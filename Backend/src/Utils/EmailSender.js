import nodemailer from "nodemailer";
export class EmailSender {
  static sendEmail = async (to, subject, body) => {
    try {
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "osama1111222@gmail.com",
          pass: "digc gomo ffan ensj",
        },
      });

      await transport.sendMail({
        from: '"HealthPal" <osama1111222@gmail.com>',
        to,
        subject,
        html: body,
      });
    } catch (error) {
      console.log("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };
}

export default EmailSender;
