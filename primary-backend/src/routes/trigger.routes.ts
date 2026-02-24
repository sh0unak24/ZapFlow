import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getAvailableTriggers } from "../controller/trigger.controller.js"

export const triggerRouter = express.Router()

triggerRouter.get("/available" , authenticate , getAvailableTriggers)