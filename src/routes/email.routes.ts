import { Router } from "express";
import { findEmailById, processingEmail, scheduleEmail, scheduleStatus, sentEmail } from "../service/email.scheduler"
import { prisma } from "../prisma/prismaConfig";

const router = Router();


router.post("/schedule", async (req, res) => {
  const { to,jobId, subject, body, scheduledAt } = req.body;

  await scheduleEmail(to, subject, body, new Date(scheduledAt));

  res.json({ success: true });
});

router.get("/allEmail", async (req, res) => {
  try {
    const email = await prisma.emailJob.findMany({});
    return res.json(email);
  } catch (err:any) {
    return res.status(500).json({ message: err.message });
  }
});
router.get("/email/:id", async (req, res) => {
  try {
    const email = await findEmailById(req.params.id);

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.json(email);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/scheduleEmail",async(req,res)=>{
const email = await scheduleStatus();
if(!email){
  res.status(404).json({msg:"No email schedule"})
}
 return res.json(email);
})
router.get("/sentEmail",async(req,res)=>{
  try{
    const email = await sentEmail();
    if(!email){
      res.status(404).json({msg:"does not found any send email"});
    }
    return res.json(email);
  } catch(error){
   console.log("error",error);
   res.status(500).json({msg:"something went wrong in sent email"})
  }
})
router.get("/processingEmail",async(req,res)=>{
  try{
    const email = await processingEmail();
    if(!email){
      res.status(404).json({msg:"does not found any processing email"});
    }
    return res.json(email);
  } catch(error){
   console.log("error",error);
   res.status(500).json({msg:"something went wrong in processing email"})
  }
})

export default router;
