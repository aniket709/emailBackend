import "dotenv/config";
import nodemailer from "nodemailer";

let transporterPromise = nodemailer.createTestAccount().then(account =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass:  process.env.SMTP_PASS
    }
  })
);
console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP HOST:", process.env.SMTP_HOST);


export async function sendEmail(to: string, subject: string, body: string) {
  const transporter = await transporterPromise;

  const info = await transporter.sendMail({
    from: '"Scheduler" <scheduler@test.com>',
    to,
    subject:"Test",
    text: "Test is successfull"
  });
}
