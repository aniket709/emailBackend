import express from "express"
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";


const app = express();
dotenv.config();
app.use(express.json());
app.use("/email", emailRoutes);

async function startServer(){
 app.listen(process.env.PORT||3001,()=>{
    `server is running on ${process.env.PORT}`
 });
}
startServer();
