import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { Icon } from 'src/components/icon'
import { config } from 'src/config'
import { removeSearchParamsFromURL } from 'src/helpers'
import { routerPaths } from 'src/router'
import { storage } from 'src/storage'
import { showErrorToast } from 'src/toasts'
import { TRPCError, trpc } from 'src/trpc'

export function LoginGithubButton() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  const [isLoading, setIsLoading] = useState(!!code)

  const { mutateAsync: loginMutation } = trpc.public.login.useMutation()

  function redirectToGithub() {
    setIsLoading(true)

    const params = `?client_id=${config.github.clientId}`
    const url = `https://github.com/login/oauth/authorize${params}`
    window.location.assign(url)
  }

  useEffect(() => {
    async function login() {
      if (!code) return

      try {
        const loginResponse = await loginMutation({ code })

        storage.auth.setToken(loginResponse.token)

        routerPaths.profile.navigate()
      } catch (e) {
        const error = e as TRPCError
        showErrorToast(error.message)
        removeSearchParamsFromURL()
      }

      setIsLoading(false)
    }

    login()
  }, [])

  return (
    <Button
      isLoading={isLoading}
      onClick={redirectToGithub}
      rightIcon={<Icon variant="chevronRight" />}
    >
      Login by GitHub
    </Button>
  )
}
