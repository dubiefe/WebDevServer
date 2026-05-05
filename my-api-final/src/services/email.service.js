import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

export const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: "My API <no-reply@api.com>",
    to: email,
    subject: "Verification code",
    text: `Your code is ${code}`
  });
};