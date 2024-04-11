import { SendMailOptions, createTransport } from 'nodemailer'

import { config } from '../config'

type Mail = Pick<SendMailOptions, 'to' | 'subject' | 'text'>

export class EmailService {
  async sendEmail(mail: Mail): Promise<void> {
    const { user, password } = config.email

    const transporter = createTransport({
      service: 'Gmail',
      auth: {
        user,
        pass: password
      }
    })

    const mailOptions: SendMailOptions = {
      from: user,
      to: mail.to,
      subject: mail.subject,
      text: mail.text
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error)
        }
        resolve()
      })
    })
  }
}
