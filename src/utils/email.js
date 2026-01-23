import Mailgen from "mailgen";
import nodemailer from "nodemailer"

// sending email should always be async 
const sendEmail = async ({ email, subject, mailgenContent }) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Management",
      link: "https://promanage.com",
    },
  });

  // Log to debug
  console.log("Mailgen Content:", JSON.stringify(mailgenContent, null, 2));

  const emailText = mailGenerator.generatePlaintext(mailgenContent);
  const emailHtml = mailGenerator.generate(mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "mail.taskmanager@example.com",
    to: email,
    subject,
    text: emailText,
    html: emailHtml,
  });
};

const emailVerificationMailContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We are excited to have you on board",
      action: {
        instructions: "To verify your email please click on the following button:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl
        }
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  };
};

const forgotPasswordMailContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We have got a request to reset your password",
      action: {
        instructions: "To reset your password please click on the following button:",
        button: {
          color: "#bc2222",
          text: "Reset Password",
          link: passwordResetUrl
        }
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  };
};

export { emailVerificationMailContent, forgotPasswordMailContent, sendEmail };