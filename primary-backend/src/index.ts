import express from "express"
import { rootRouter } from "./routes/root.router.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())
const PORT = process.env.PORT

app.use("/api/v1" , rootRouter)


app.listen(PORT , () => {
    console.log(`Server Started on ${PORT}`)
})