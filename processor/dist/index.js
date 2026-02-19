import { Kafka } from "kafkajs";
import { prisma } from "./lib/prisma.js";
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});
const TOPIC_NAME = "zap-events";
async function main() {
    const producer = kafka.producer();
    await producer.connect();
    while (1) {
        const pendingRows = await prisma.zapRunOutBox.findMany({
            where: {},
            take: 10
        });
        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => ({
                value: r.zapRunId
            }))
        });
        await prisma.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(x => x.id)
                }
            }
        });
    }
}
main();
