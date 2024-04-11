const nodemailer = require('nodemailer')

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mergereminder@gmail.com', // Your email address
    pass: 'qjnw auni srsc zvcd' // Your password
  }
})

// Email content
let mailOptions = {
  from: 'mergereminder@gmail.com', // Sender address
  to: 'sztadii@gmail.com', // List of recipients
  subject: 'Test Email', // Subject line
  text: 'This is a test email sent from Node.js using Nodemailer.' // Plain text body
}

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error)
  }
  console.log('Message sent: %s', info.messageId)
})
