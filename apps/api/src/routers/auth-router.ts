import { AuthController } from '../controllers/auth-controller'
import { GithubAuthRepository } from '../repositories/github-auth-repository'
import { InstallationRepository } from '../repositories/installation-repository'
import { ReposConfigurationsRepository } from '../repositories/repos-configurations-repository'
import { UsersRepository } from '../repositories/users-repository'
import { LoginRequestSchema, LoginResponseSchema } from '../schemas'
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  login: publicProcedure
    .input(LoginRequestSchema)
    .output(LoginResponseSchema)
    .mutation(opts => {
      const githubAuthRepository = new GithubAuthRepository()
      const usersRepository = new UsersRepository(opts.ctx.database)
      const installationRepository = new InstallationRepository(usersRepository)
      const reposConfigurationsRepository = new ReposConfigurationsRepository(
        opts.ctx.database
      )
      const authController = new AuthController(
        usersRepository,
        reposConfigurationsRepository,
        githubAuthRepository,
        installationRepository
      )

      return authController.login(opts.input)
    })
})
