import express from "express";
export const userRouter = express.Router();
// userRouter.use("/signup" , )
userRouter.get("/", () => {
    console.log("inside user router");
});
