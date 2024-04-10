import { Button, Flex } from '@chakra-ui/react'
import { useEffect } from 'react'

import { config } from 'src/config'
import { routerPaths } from 'src/router'
import { storage } from 'src/storage'
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

        storage.auth.setToken(loginResponse.token)

        routerPaths.users.navigate()
      } catch (e) {
        const error = e as TRPCError
        showErrorToast(error.message)
        routerPaths.login.navigate() // To remove code from URL
      }
    }

    login()
  }, [])

  return (
    <Flex
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
    >
      <Button onClick={redirectToGithub}>Login by GitHub</Button>
    </Flex>
  )
}
