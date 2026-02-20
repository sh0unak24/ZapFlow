import express from "express";
import { rootRouter } from "./routes/root.router.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;
app.use("/api/v1", rootRouter);
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
});
