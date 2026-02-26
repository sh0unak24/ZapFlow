"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const kafkajs_1 = require("kafkajs");
const prisma_1 = require("./lib/prisma");
const parse_1 = require("./parse");
const email_1 = require("./email");
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});
const TOPIC_NAME = "zap-events";
async function main() {
    const producer = kafka.producer();
    await producer.connect();
    const consumer = kafka.consumer({ groupId: "main-worker" });
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPIC_NAME,
        fromBeginning: false
    });
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });
            await new Promise(r => setTimeout(r, 1000));
            if (!message.value?.toString()) {
                return;
            }
            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;
            const zapRunDetails = await prisma_1.prisma.zapRun.findFirst({
                where: {
                    id: zapRunId
                }, include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    availableAction: true
                                }
                            }
                        }
                    }
                }
            });
            if (!zapRunDetails) {
                console.log("ZapRun not found");
                return;
            }
            const currentAction = zapRunDetails.zap.actions.find((a) => a.sortingOrder === stage);
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
                    const body = (0, parse_1.parse)(currentAction.metadata.body, zapRunMetadata);
                    const to = (0, parse_1.parse)(currentAction.metadata.email, zapRunMetadata);
                    console.log(`Sending email to ${to} with body ${body}`);
                    await (0, email_1.sendEmail)(to, body);
                    break;
                case "Solana":
                    const amount = (0, parse_1.parse)(currentAction.metadata.amount, zapRunMetadata);
                    const address = (0, parse_1.parse)(currentAction.metadata.address, zapRunMetadata);
                    console.log(`Sending out SOL ${amount} to address ${address}`);
                    break;
                default:
                    console.log("Unknown action type");
            }
            const lastStage = (zapRunDetails.zap.actions.length || 1) - 1;
            if (lastStage != stage) {
                console.log("Producing new action in consumer");
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                            value: JSON.stringify({
                                stage: stage + 1,
                                zapRunId
                            })
                        }]
                });
            }
            console.log("Executing action:", currentAction.availableAction.name);
            await consumer.commitOffsets([{
                    topic: TOPIC_NAME,
                    partition: partition,
                    offset: (parseInt(message.offset) + 1).toString()
                }]);
        },
    });
}
main();
