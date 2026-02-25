import { Kafka } from "kafkajs"
import { prisma } from "./lib/prisma";
import { JsonObject } from "@prisma/client/runtime/client";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

const TOPIC_NAME = "zap-events"

async function main(){
    const producer = kafka.producer();
    await producer.connect();

    const consumer =  kafka.consumer({groupId : "main-worker"})
    await consumer.connect()

    await consumer.subscribe({
        topic : TOPIC_NAME,
        fromBeginning : false
    })

    await consumer.run({
        autoCommit : false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })
            await new Promise(r => setTimeout(r , 1000))

            if(!message.value?.toString()){
                return;
            }
            const parsedValue = JSON.parse(message.value?.toString())
            const zapRunId = parsedValue.zapRunId
            const stage = parsedValue.stage

            const zapRunDetails = await prisma.zapRun.findFirst({
                where : {
                    id : zapRunId
                } , include : {
                    zap : {
                        include : {
                            actions : {
                                include : {
                                    availableAction : true
                                }
                            }
                        }
                    }
                }
            })

            if (!zapRunDetails) {
                console.log("ZapRun not found");
                return;
            }
          
            const currentAction = zapRunDetails.zap.actions.find(
                (a) => a.sortingOrder === stage
            );
        
            if (!currentAction || !currentAction.availableAction) {
                console.log("No action to execute");
                return;
            }

            switch (currentAction.availableAction?.name) {
                case "Email":
                    const emailMetadata = (currentAction.metadata as JsonObject)
                    const to = emailMetadata.to
                    const body = emailMetadata.body

                    const zapRunMetadata = zapRunDetails.metadata;
                    
                    console.log("Sending email")
                    break;
              
                case "Solana":
                    const solanaMetadata = (currentAction.metadata as JsonObject)
                    const amount = solanaMetadata.amont
                    const solAddress = solanaMetadata.address
                    console.log("Sending solana")
                  break;
              
                default:
                  console.log("Unknown action type");
              }
            const lastStage = (zapRunDetails.zap.actions.length || 1) - 1;

            if(lastStage != stage){
                console.log("Producing new action in consumer")
                await producer.send({
                    topic : TOPIC_NAME,
                    messages : [{
                        value : JSON.stringify({
                            stage : stage + 1,
                            zapRunId
                        })
                    }]
                })
            }
            console.log(
                "Executing action:",
                currentAction.availableAction.name
            );
          

            await consumer.commitOffsets([{
                topic : TOPIC_NAME,
                partition : partition,
                offset : (parseInt(message.offset) + 1).toString()
            }])
        },
    })
        
}

main()