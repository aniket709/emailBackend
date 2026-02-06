import { UUID } from "crypto";
import { prisma } from "../prisma/prismaConfig";
import { emailQueue } from "../queue/email.queue";

export async function scheduleEmail(
  to: string,
  subject: string,
  body: string,
  scheduledAtInput: string | Date
) {
  const job = await prisma.emailJob.create({
    data: {
      subject,
      body,
      scheduledAt: new Date(scheduledAtInput),
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
