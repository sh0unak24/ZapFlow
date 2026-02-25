import { Kafka } from "kafkajs";
import { prisma } from "./lib/prisma.js";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

const TOPIC_NAME = "zap-events";
const POLL_INTERVAL_MS = 1000;

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  console.log("Outbox processor started");

  while (true) {
    const pendingRows = await prisma.zapRunOutBox.findMany({
      take: 10,
    });
    console.log(pendingRows)
    if (pendingRows.length === 0) {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    await producer.send({
      topic: TOPIC_NAME,
      messages: pendingRows.map((r) => ({
        value: JSON.stringify({
            zapRunId : r.zapRunId,
            stage : 0
        })
      })),
    });

    await prisma.zapRunOutBox.deleteMany({
      where: {
        id: {
          in: pendingRows.map((x) => x.id),
        },
      },
    });
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error("Outbox processor failed", err);
  process.exit(1);
});