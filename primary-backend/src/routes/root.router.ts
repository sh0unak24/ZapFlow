import express from "express"
import { userRouter } from "./user.router.js"
import { zapRouter } from "./zap.router.js"

export const rootRouter = express.Router()

rootRouter.use("/user" , userRouter)
rootRouter.use("/zap" , zapRouter)