"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
// import { prisma } from "./lib/prisma.js"
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});
const TOPIC_NAME = "zap-events";
async function main() {
    const producer = kafka.producer();
    await producer.connect();
    while (1) {
        const consumer = kafka.consumer({ groupId: "main-worker" });
        await consumer.connect();
        await consumer.subscribe({
            topic: TOPIC_NAME,
            fromBeginning: true
        });
        await consumer.run({
            autoCommit: false,
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value?.toString(),
                });
            },
        });
        await new Promise(r => setTimeout(r, 1000));
    }
}
main();
