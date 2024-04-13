import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { Icon } from 'src/components/icon'
import { routerPaths } from 'src/router'
import { showErrorToast } from 'src/toasts'
import { TRPCError, trpc } from 'src/trpc'

export function InstallReposButton() {
  const params = new URLSearchParams(window.location.search)
  const installationId = params.get('installation_id')

  const [isLoading, setIsLoading] = useState(!!installationId)

  const { mutateAsync: updateInstallationIdMutation } =
    trpc.client.updateInstallationId.useMutation()

  const { data: user } = trpc.client.getCurrentUser.useQuery()

  const queryClient = useQueryClient()

  function redirectToGithub() {
    setIsLoading(true)

    const url = `https://github.com/apps/merge-reminder/installations/select_target`
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

        // TODO Create a function to remove query params from URL
        routerPaths.profile.navigate() // To remove ?installation_id="" from URL
      } catch (e) {
        const error = e as TRPCError
        showErrorToast(error.message)
        // TODO Create a function to remove query params from URL
        routerPaths.profile.navigate() // To remove ?installation_id="" from URL
      }

      setIsLoading(false)
    }

    installRepos()
  }, [])

  if (user?.hasInstallationId) return

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