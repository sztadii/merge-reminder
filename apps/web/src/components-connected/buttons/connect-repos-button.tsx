import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { Icon } from 'src/components/icon'
import { config } from 'src/config'
import { getSearchParams, removeSearchParamsFromURL } from 'src/helpers'
import { showErrorToast } from 'src/toasts'
import { TRPCError, trpc } from 'src/trpc'

export function ConnectReposButton() {
  const params = getSearchParams()
  const installationId = params.get('installation_id')

  const [isLoading, setIsLoading] = useState(!!installationId)

  const { mutateAsync: connectRepositoriesMutation } =
    trpc.client.connectRepositories.useMutation()

  const queryClient = useQueryClient()

  function redirectToGithub() {
    setIsLoading(true)

    const url = `https://github.com/apps/${config.github.appName}/installations/select_target`
    window.location.assign(url)
  }

  useEffect(() => {
    async function installRepos() {
      if (!installationId) return

      try {
        await connectRepositoriesMutation({
          installationId: Number(installationId)
        })

        await queryClient.invalidateQueries(
          getQueryKey(trpc.client.getCurrentUser)
        )

        queryClient
          .invalidateQueries(getQueryKey(trpc.client.getCurrentWarnings))
          .then()
      } catch (e) {
        const error = e as TRPCError
        showErrorToast(error.message)
      }

      removeSearchParamsFromURL()

      setIsLoading(false)
    }

    installRepos()
  }, [])

  return (
    <Button
      isLoading={isLoading}
      onClick={redirectToGithub}
      rightIcon={<Icon variant="chevronRight" />}
      width={{
        base: '100%',
        md: 'auto'
      }}
      colorScheme="teal"
    >
      Connect repositories
    </Button>
  )
}
