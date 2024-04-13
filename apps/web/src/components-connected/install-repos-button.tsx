import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { Icon } from 'src/components/icon'
import { config } from 'src/config'
import { removeSearchParamsFromURL } from 'src/helpers'
import { showErrorToast } from 'src/toasts'
import { TRPCError, trpc } from 'src/trpc'

export function InstallReposButton() {
  const params = new URLSearchParams(window.location.search)
  const installationId = params.get('installation_id')

  const [isLoading, setIsLoading] = useState(!!installationId)

  const { mutateAsync: updateInstallationIdMutation } =
    trpc.client.updateInstallationId.useMutation()

  const queryClient = useQueryClient()

  function redirectToGithub() {
    setIsLoading(true)

    const { appName } = config.github
    const url = `https://github.com/apps/${appName}/installations/select_target`
    window.location.assign(url)
  }

  useEffect(() => {
    async function installRepos() {
      if (!installationId) return

      try {
        await updateInstallationIdMutation({
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
    >
      Install repositories
    </Button>
  )
}
