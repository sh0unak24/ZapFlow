import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getAvailableActions } from "../controller/action.controller.js"

export const actionRouter = express.Router()

actionRouter.get("/available" , authenticate , getAvailableActions)