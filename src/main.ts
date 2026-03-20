import express from "express"
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";
// import swaggerUi from "swagger-ui-express";
import { limiter } from "./service/rateLimit.service";
import uploadRoutes from "./routes/upload.routes";

const app = express();
dotenv.config();

app.use(express.json());
app.use(limiter)
app.use("/email", emailRoutes);
app.use("/upload", uploadRoutes);

async function startServer(){
 app.listen(process.env.PORT||3001,()=>{
    `server is running on ${process.env.PORT}`
 });
}
startServer();
