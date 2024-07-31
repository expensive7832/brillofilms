import express from "express"
import { register, login, updateUser } from "./../controllers/user.js"
import protect from "../middleware/protect.js"

const app = express()

app.post("/register", register)
app.post("/login", login)
app.patch("/update", protect, updateUser)



export default app