import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

export const getAvailableTriggers = async ( req : AuthRequest , res : Response) => {
    try {
        const availableTriggers = await prisma.availableTrigger.findMany()
        if(!availableTriggers){
            return res.status(404).json({
                message : "Unable to find available triggers"
            })
        }

        return res.status(200).json({
            message : "Available triggers found",
            availableTriggers
        })
    } catch(err){
        console.error("[AVAILABLE TRIGGERS FETCH ERROR]")
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}