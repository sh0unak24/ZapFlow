require('dotenv').config()

import { Kafka } from "kafkajs"
import { prisma } from "./lib/prisma";
import { JsonObject } from "@prisma/client/runtime/client";
import {parse} from "./parse"
import { sendEmail } from "./email";

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
            const zapRunMetadata = zapRunDetails?.metadata;
            //console.log(`ZAP RUN METADAT IS ${JSON.stringify(zapRunMetadata)}`)

            switch (currentAction.availableAction?.name) {
                case "Email":
                    //console.log("-----------------------------------------")
                    //console.log(`CURRENT ACTION METADAT IS ${JSON.stringify(currentAction.metadata)}`)
                    const body = parse((currentAction.metadata as JsonObject).body as string , zapRunMetadata) 
                    const to = parse((currentAction.metadata as JsonObject).email as string , zapRunMetadata) 

                    console.log(`Sending email to ${to} with body ${body}`)
                    await sendEmail(to , body)
                    break;
              
                case "Solana":

                    const amount = parse((currentAction.metadata as JsonObject).amount as string , zapRunMetadata) 
                    const address = parse((currentAction.metadata as JsonObject).address as string , zapRunMetadata) 

                    console.log(`Sending out SOL ${amount} to address ${address}`)
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