import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";

import { ZapCreateSchema } from "../validators/zap.schema.js";
import { prisma } from "../lib/prisma.js";

export const createZap = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsedData = ZapCreateSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error,
      });
    }

    const zapId = await prisma.$transaction(async (tx) => {
      const zap = await tx.zap.create({
        data: {
          user: {
            connect: { id: req.user!.id },
          },
          actions: {
            create: parsedData.data.actions.map((x, index) => ({
              name: x.actionName,
              availableActionId: x.availableActionId,
              sortingOrder: index,
              metadata: x.actionMetadata ?? {},
            })),
          },
        },
      });

      await tx.trigger.create({
        data: {
          zap: {
            connect: { id: zap.id },
          },
          type: {
            connect: { id: parsedData.data.avaialbleTriggerId },
          },
          metadata: parsedData.data.triggerMetadata ?? {},
        },
      });

      return zap.id;
    });

    return res.status(201).json({
      message: "Zap created successfully",
      zapId,
    });
  } catch (err) {
    console.error("[CREATE ZAP ERROR]", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getZapsForUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const zaps = await prisma.zap.findMany({
        where: { userId },
        include: {
          trigger: { include: { type: true } },
          actions: {
            include: { availableAction: true },
            orderBy: { sortingOrder: "asc" },
          },
        },
      });

      if (!zaps) {
        return res.status(400).json({ message: "No Zaps Found" });
      }

      return res.status(200).json({
        message: "Zaps found",
        zaps,
      });
    } catch (err) {
      console.error("[GET ZAPS FOR USER ERROR]", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getZap = async (req : AuthRequest , res : Response) =>{
    try {
        const userId = req.user?.id
        const zapId = req.params.zapId as string

        const zaps = await prisma.zap.findMany({
            where: { userId  , id : zapId},
            include: {
              trigger: { include: { type: true } },
              actions: {
                include: { availableAction: true },
                orderBy: { sortingOrder: "asc" },
              },
            },
        });

        if (!zaps) {
            return res.status(400).json({ message: "No Zaps Found" });
        }
        
        return res.status(200).json({
            message: "Zaps found",
            zaps,
        });
    }catch(err){
        console.error("[GET ZAPS BY ID ERROR]", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}