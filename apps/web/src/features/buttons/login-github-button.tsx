import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { Icon } from '@apps/web/components/icon'
import { config } from '@apps/web/config'
import { getSearchParams, removeSearchParamsFromURL } from '@apps/web/helpers'
import { showErrorToast } from '@apps/web/libs/toasts'
import { TRPCError, trpc } from '@apps/web/libs/trpc'
import { routerPaths } from '@apps/web/router'
import { storage } from '@apps/web/storage'

export function LoginGithubButton() {
  const params = getSearchParams()
  const code = params.get('code')
  const error = params.get('error')

  const [isLoading, setIsLoading] = useState(!!code)

  const { mutateAsync: loginMutation } = trpc.auth.login.useMutation()

  function redirectToGithub() {
    setIsLoading(true)

    const params = `?client_id=${config.github.authClientId}`
    const url = `https://github.com/login/oauth/authorize${params}`

    window.location.assign(url)
  }

  useEffect(() => {
    async function handleLogin() {
      if (!code) return

      try {
        const loginResponse = await loginMutation({ code })

        storage.auth.setToken(loginResponse.token)

        if (loginResponse.isDeletedUser) {
          routerPaths.stopDeletion.navigate()
        } else if (loginResponse.isNewUser) {
          routerPaths.onboarding.navigate()
        } else {
          routerPaths.dashboard.navigate()
        }
      } catch (e) {
        const error = e as TRPCError
        showErrorToast(error.message)
        removeSearchParamsFromURL()
      }

      setIsLoading(false)
    }

    function handleError() {
      if (!error) return

      showErrorToast('Access denied.')
      removeSearchParamsFromURL()
    }

    handleLogin()
    handleError()
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
