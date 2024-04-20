import { IconButton, useDisclosure } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { Confirmation } from 'src/components/confirmation'
import { Icon } from 'src/components/icon'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

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
