import express from "express"
import { rootRouter } from "./routes/root.router.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT

app.use("/api/v1" , rootRouter)


app.listen(PORT , () => {
    console.log(`Server Started on ${PORT}`)
})