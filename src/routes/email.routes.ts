import { Router } from "express";
import { scheduleEmail } from "../service/email.scheduler"

const router = Router();

router.post("/schedule", async (req, res) => {
  const { to,jobId, subject, body, scheduledAt } = req.body;

  await scheduleEmail(to, subject, body, new Date(scheduledAt));

  res.json({ success: true });
});

export default router;
