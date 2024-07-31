import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import userRoute from "./routes/user.js"
import uploadRoute from "./routes/upload.js"

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors({
    origin: "*"
}))

app.use(userRoute)
app.use(uploadRoute)





app.listen(process.env.PORT || 5000, () =>{
    console.log(`server is running on ${process.env.PORT}`);
})
