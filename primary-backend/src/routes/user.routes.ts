import express from "express"
import { Login, Signup } from "../controller/auth.controller.js"
import { me } from "../controller/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

export const userRouter = express.Router()

userRouter.post("/signup" , Signup)
userRouter.post("/login" , Login)
userRouter.get("/me" , authenticate , me)

