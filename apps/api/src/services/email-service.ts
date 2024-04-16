import axios from 'axios'

import { config } from '../config'

export class EmailService {
  async sendEmail(mail: Mail): Promise<void> {
    const { domainName } = config.mailgun

    await axios({
      method: 'post',
      url: `https://api.mailgun.net/v3/${domainName}/messages`,
      auth: {
        username: 'api',
        password: config.mailgun.apiKey
      },
      params: {
        from: `Merge Reminder <notifications@${domainName}>`,
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
