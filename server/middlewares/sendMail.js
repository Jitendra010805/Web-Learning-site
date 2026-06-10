import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  try {
    const transport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL || process.env.Gmail,
        pass: process.env.PASSWORD || process.env.password,
      },
    });

    let html = "";

    if (subject.toLowerCase() === "otp verification") {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f3f3; }
    .container { background-color: #fff; padding: 20px 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
    h1 { color: #e74c3c; }
    p { color: #555; margin: 10px 0; }
    .otp { font-size: 32px; font-weight: bold; color: #7b68ee; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p>Hello <strong>${data.name}</strong>,</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <div class="otp">${data.otp}</div>
    <p>This OTP will expire shortly. Please do not share it with anyone.</p>
  </div>
</body>
</html>`;
    } else if (subject === "Reset Password") {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f3f3; }
    .container { background-color: #fff; padding: 20px 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
    h1 { color: #e74c3c; }
    p { color: #555; margin: 10px 0; }
    .link { font-size: 18px; font-weight: bold; color: #7b68ee; margin: 20px 0; text-decoration: none; display: inline-block; padding: 10px 20px; border: 1px solid #7b68ee; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Password</h1>
    <p>Hello,</p>
    <p>You requested to reset your password. Click the link below to proceed:</p>
    <a href="${data.url}" class="link">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>`;
    }

    await transport.sendMail({
      from: process.env.GMAIL || process.env.Gmail,
      to: email,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

export default sendMail;
