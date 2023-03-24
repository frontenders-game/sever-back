// import * as nodemailer from "nodemailer"
//
// const mailer = nodemailer.createTransport(
//     {
//         host: String(process.env.MAILER_HOST),
//         port: String(process.env.MAILER_PORT),
//         secure: parseInt(process.env.MAILER_PORT || 0) === 465,
//         auth: {
//             user: String(process.env.MAILER_EMAIL),
//             pass: String(process.env.MAILER_PASSWORD)
//         }
//     },
//     {
//         from: `${process.env.MAILER_NAME} <${process.env.MAILER_EMAIL}>`
//     }
// )
//
// export async function sendEmail(to: string, subject: string, message: string) {
//     await mailer.sendMail({to, subject, html: message})
// }