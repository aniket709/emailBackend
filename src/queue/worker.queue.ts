
import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redis } from "../config/redis";
import { sendEmail } from "../service/email.service"
import { prisma } from "../prisma/prismaConfig";

const worker = new Worker(
  "email-queue",
  async (job: Job) => {
    const { to, subject, body,jobId } = job.data;

    try {
      await prisma.emailJob.update({
        where:{
          id:jobId,
        },
        data:{
          status:'PROCESSING'
        }
      });
      await sendEmail(to, subject, body);
      await prisma.emailRecipient.updateMany({
        where:{
          jobId:jobId,
        },
        data:{
          status:'SENT',
          sentAt: new Date()
        }
      });
      await prisma.emailJob.update({
              where: { id: jobId },
               data: { status: "SENT" }
             });
              console.log("Email sent:", job.id);

    } catch(error) {

      console.error("Email failed:", error);

      await prisma.emailRecipient.updateMany({
       where: {  jobId:jobId },
        data: {
          status: "FAILED",
          error: String(error)
        }
      });
      await prisma.emailJob.update({
        where: { id: jobId },
        data: { status: "FAILED" }
      });
      throw error;
    }
    console.log("Email sent to:", to);
  },
  {
    connection: redis,
    concurrency: Number(process.env.WORKER_CONCURRENCY || 5)
  }
);


worker.on("completed", job => {
  console.log(`Job completed ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`Job failed ${job?.id}`, err);
});

console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP HOST:", process.env.SMTP_HOST);
console.log("SMTP PORT:", process.env.SMTP_PORT);

