import { useEffect } from 'react'

import { config } from 'src/config'
import { routerPaths } from 'src/router'
import { showErrorToast } from 'src/toasts'
import { TRPCError, trpc } from 'src/trpc'

export function Login() {
  const { mutateAsync: loginMutation } = trpc.auth.login.useMutation()

  const redirectToGithub = () => {
    const params = `?client_id=${config.github.clientId}`
    window.location.assign(`https://github.com/login/oauth/authorize${params}`)
  }

  useEffect(() => {
    async function login() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) return

      try {
        const loginResponse = await loginMutation({ code })

        localStorage.setItem('token', loginResponse.token)

        routerPaths.users.navigate()
      } catch (e) {
        const error = e as TRPCError
        showErrorToast(error.message)
      }
    }

    login()
  }, [])

  return (
    <>
      <button onClick={redirectToGithub}>Login</button>
    </>
  )
}
