import { Button, useDisclosure } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

import { Confirmation } from 'src/components/confirmation'
import { Icon } from 'src/components/icon'
import { UserResponse } from 'src/schemas'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type DisconnectReposButtonProps = {
  user?: UserResponse
}

export function DisconnectReposButton({ user }: DisconnectReposButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const { mutateAsync: disconnectRepositoriesMutation } =
    trpc.client.disconnectRepositories.useMutation()

  const queryClient = useQueryClient()

  const {
    isOpen: isOpenForConfirmModal,
    onOpen: onOpenForConfirmModal,
    onClose: onCloseForConfirmModal
  } = useDisclosure()

  async function disconnectRepos() {
    if (!user) return

    try {
      setIsPending(true)
      onCloseForConfirmModal()

      await disconnectRepositoriesMutation()
      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )
      showSuccessToast('Successfully disconnected repositories.')
    } catch {
      showErrorToast('Cannot disconnect repositories.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <Button
        isDisabled={!user || !user.hasInstallationId}
        isLoading={isPending}
        onClick={onOpenForConfirmModal}
        colorScheme="red"
        width={{
          base: '100%',
          md: 'auto'
        }}
        rightIcon={<Icon variant="warning" />}
      >
        Disconnect
      </Button>

      <Confirmation
        isOpen={isOpenForConfirmModal}
        onClose={onCloseForConfirmModal}
        title="Disconnect repositories"
        description="Do you want to disconnect all your repositories?"
        confirmButton={{
          text: 'Disconnect',
          onClick: disconnectRepos
        }}
      />
    </>
  )
}
