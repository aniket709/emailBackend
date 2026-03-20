
import { prisma } from "../prisma/prismaConfig";
import { emailQueue } from "../queue/email.queue";

export async function scheduleEmail(
  to: string,
  subject: string,
  body: string,
  scheduledAtInput: string | Date,
  fileIds?: number[]
) {

  console.log("fileIds received:", fileIds);

  const job = await prisma.emailJob.create({
    data: {
      subject,
      body,
      scheduledAt: new Date(scheduledAtInput),
      // attachments: fileIds
      // ? {
      //     connect: fileIds.map((id: number) => ({ id })),
      //   }
      // : undefined,
      recipients: {
        create: [
          {
            email: to
          }
        ]
      }
    },
    include: {
      recipients: true
    }
  });
  if (fileIds?.length) {
    await prisma.fileUpload.updateMany({
      where: {
        id: { in: fileIds },
      },
      data: {
        emailJobId: job.id,
      },
    });

  console.log("Linking files:", fileIds, "to job:", job.id);
const updatedFiles = await prisma.fileUpload.findMany({
  where: { id: { in: fileIds || [] } }
});
console.log("Updated files:", updatedFiles);
  }

  const scheduledAt = new Date(scheduledAtInput);

  const scheduledTime = scheduledAt.getTime();

  if (isNaN(scheduledTime)) {
    throw new Error("Invalid scheduledAt date");
  }

  let delay = scheduledTime - Date.now();

  if (!isFinite(delay) || isNaN(delay)) {
    delay = 0;
  }

  if (delay < 0) delay = 0;

  console.log("Delay:", delay);
  console.log("ScheduledAt:", scheduledAt.toISOString());

  await emailQueue.add(
    "send-email",
    { to, subject, body, jobId: job.id },
    { delay }
  );
  return job;
}
export async function findEmailById(
  id : any
){
try {
  const emailId = await prisma.emailJob.findUnique({
    where:{
      id:id
    },
    include: {
      recipients: true,
      attachments: true, 
    },
  })
  console.log(" Email Data:", emailId);

  return emailId;
} catch (error:any){
  console.log("error",error);
throw error;
}
}
export async function scheduleStatus(){
  try{
  const email = await prisma.emailJob.findMany({
   where:{
    status:'SCHEDULED',
   },
   orderBy:{
    createdAt:'desc'
   }
  })
  return email;
  } catch(error:any){
    console.log("error",error);
  }

}
export async function sentEmail(){
  
  try{
    const email = await prisma.emailJob.findMany({
      where:{
        status:'SENT',
      },
      orderBy:{
        createdAt:'desc'
      }
    })
    return email;
  } catch (error){
    console.log("error",error)
  }
}
export async function processingEmail(){
  
  try{
    const email = await prisma.emailJob.findMany({
      where:{
        status:'PROCESSING',
      },
      orderBy:{
        createdAt:'desc'
      }
    })
    return email;
  } catch (error){
    console.log("error",error)
  }
}
