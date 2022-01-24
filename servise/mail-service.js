const nodemailer = require("nodemailer");
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: process.env.SMTP_USER,
      text: "",
      html: `
              <div><h1>
              Для активации перейдите по ссылке <a href="${link}">${link}</a> 
              </h1></div>
          `,
    });
  }
}
module.exports = new MailService();
