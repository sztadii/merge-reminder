export const config = {
  github: {
    authClientId: process.env.GITHUB_AUTH_CLIENT_ID!,
    appName: process.env.GITHUB_APP_NAME!
  },
  trpc: {
    url: process.env.TRPC_URL!
  }
}
