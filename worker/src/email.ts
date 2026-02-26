import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmail(to : string , body : string) {
    await transporter.sendMail({
        from : "joshishounak99@gmail.com",
        sender : "joshishounak99@gmail.com",
        to : to,
        subject : "Hello from ZapFlow",
        text : body
    })
}