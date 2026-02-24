import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createZap, getZap, getZapsForUser } from "../controller/zap.controller.js";
export const zapRouter = express.Router();
// zapRouter.use("/user" , )
zapRouter.post("/", authenticate, createZap);
zapRouter.get("/me", authenticate, getZapsForUser);
zapRouter.get("/:zapId", authenticate, getZap);
