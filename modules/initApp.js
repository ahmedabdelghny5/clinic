import { connection } from "../DB/dbConnection.js"
import path from 'path'
import { config } from 'dotenv'
config({ path: path.resolve("config/.env") })
import patientRouter from "./patient/patient.routes.js"
import doctorRouter from "./doctor/doctor.routes.js"
import adminRouter from "./admins/admin.routes.js"
import commentRouter from "./comment/comment.routes.js"
import replyRouter from "./reply/reply.routes.js"
import illnessRouter from "./illness/illness.routes.js"
import { AppError, globalErrorHandel } from "../utils/globalError.js"
const port = process.env.PORT

export const initApp = (app, express) => {


    app.use(express.json())
    

    app.use("/patients", patientRouter)
    app.use("/doctors", doctorRouter)
    app.use("/admins", adminRouter)
    app.use("/comments", commentRouter)
    app.use("/reply", replyRouter)
    app.use("/illness", illnessRouter)
    
    app.all("*", (req, res, next) => {
        next(new AppError(`inValid path ${req.originalUrl}`, 404))
    })

    app.use(globalErrorHandel)
    
    connection
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}