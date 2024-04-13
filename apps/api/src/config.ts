export const config = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    secret: process.env.GITHUB_CLIENT_SECRET!,
    appId: process.env.GITHUB_APP_ID!
  },
  email: {
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASSWORD!
  }
}
