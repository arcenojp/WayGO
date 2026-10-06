import nodemailer from "nodemailer";

// Sends the one-time codes. Without SMTP settings (development), the email
// is printed in the server log instead of being sent.
export function createMailer({ smtp, mailFrom }) {
  const transport = smtp ? nodemailer.createTransport(smtp) : null;

  return {
    async sendCode(to, code, purpose) {
      const subject = purpose === "register" ? "Your WayGo verification code" : "Your WayGo password reset code";
      const action = purpose === "register" ? "finish creating your account" : "reset your password";
      const body = `Your WayGo code is ${code}.\n\nEnter it to ${action}. It expires in 10 minutes.\n\nIf you didn't ask for this, you can ignore this email.`;

      if (!transport) {
        console.log(`[mail] to ${to}: ${subject}: ${code}`);
        return;
      }
      await transport.sendMail({ from: mailFrom, to, subject, text: body });
    },
  };
}
