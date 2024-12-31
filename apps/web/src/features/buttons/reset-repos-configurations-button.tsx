import { IconButton, useDisclosure } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { Confirmation } from '@apps/web/components/confirmation'
import { Icon } from '@apps/web/components/icon'
import { showErrorToast, showSuccessToast } from '@apps/web/libs/toasts'
import { trpc } from '@apps/web/libs/trpc'

export function ResetReposConfigurationsButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    mutateAsync: resetConfigurationsMutation,
    isLoading: isSendingWarnings
  } = trpc.client.updateCurrentRepositoriesConfiguration.useMutation()

  const queryClient = useQueryClient()

  async function resetConfigurations() {
    onClose()

    try {
      await resetConfigurationsMutation({
        repos: []
      })

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentRepositoriesConfiguration)
      )

      showSuccessToast('Configurations has been reset.')

      queryClient
        .invalidateQueries(getQueryKey(trpc.client.getCurrentWarnings))
        .then()
    } catch {
      showErrorToast('Something went wrong when resetting.')
    }
  }

  return (
    <>
      <IconButton
        aria-label="reset configurations"
        icon={<Icon variant="delete" />}
        colorScheme="red"
        isLoading={isSendingWarnings}
        onClick={onOpen}
      />

      <Confirmation
        isOpen={isOpen}
        onClose={onClose}
        title="Reset configurations"
        description={
          <>
            Are you sure you want to reset all repositories configurations' and
            use the default values?
          </>
        }
        confirmButton={{
          text: 'Reset',
          onClick: resetConfigurations
        }}
      />
    </>
  )
}
