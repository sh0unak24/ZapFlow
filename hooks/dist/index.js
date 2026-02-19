import express from 'express';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    try {
        const zapId = req.params.zapId;
        const userId = req.params.userId;
        const body = req.body;
        const result = await prisma.$transaction(async (tx) => {
            const run = await tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: body,
                },
            });
            await tx.zapRunOutBox.create({
                data: {
                    zapRunId: run.id
                }
            });
        });
        return res.status(200).json({
            success: true,
            message: "Zap run created successfully",
            data: result,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
