import express from "express"
import { upload , getAllMovies} from "../controllers/Upload.js"
import protect from "../middleware/protect.js"

const app = express()

app.post("/upload", protect, upload)
app.get("/allmovies", getAllMovies)



export default app