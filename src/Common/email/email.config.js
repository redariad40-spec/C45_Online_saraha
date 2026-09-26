import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "../../../config/config.service.js";

const transporter = nodemailer.createTransport({
    service:"gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS

  },
});

async function sendMail({to,subject,text,html,attachments}){

  const info = await transporter.sendMail({
  from: `Route <${MAIL_USER}>`,
  to,
  subject,
  text,
  html ,
  attachments
});

console.log("Message sent:", info.messageId);
}
export default sendMail;