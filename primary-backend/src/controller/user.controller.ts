import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

export const me = async (req : AuthRequest , res : Response) => {
    try{
        const id = req.user?.id;
        if(!id){
            return res.status(401).json({
                message : "Please log in"
            })
        }

        const user = await prisma.user.findUnique({
            where : {
                id
            } , select : {
                id : true,
                email : true,
                name : true
            }
        })

        if(!user){
            return res.status(400).json({
                message : "User does not exist"
            })
        }

        return res.status(200).json({
            user
        })

    }catch(err){
        console.error("[ME ERROR]" , err)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}