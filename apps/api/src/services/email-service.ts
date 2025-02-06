import axios from 'axios'

import { config } from '@apps/api/config'

export class EmailService {
  async sendEmail(mail: Mail): Promise<void> {
    const { apiKey } = config.mail

    await axios({
      method: 'post',
      url: 'https://api.resend.com/emails',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      data: {
        from: 'Merge Reminder <notifications@resend.dev>',
        to: mail.to,
        subject: mail.subject,
        text: mail.text
      }
    })
  }
}

type Mail = {
  to: string
  subject: string
  text: string
}
