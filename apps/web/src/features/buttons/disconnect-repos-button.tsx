import { Button, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

import { UserResponse } from '@apps/shared/schemas'

import { Confirmation } from '@apps/web/components/confirmation'
import { Icon } from '@apps/web/components/icon'
import { showErrorToast, showSuccessToast } from '@apps/web/libs/toasts'
import { trpc } from '@apps/web/libs/trpc'

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

  function getDisabledMessage() {
    const hasInstallationId = user?.hasInstallationId === true

    if (!hasInstallationId)
      return 'You do not have any connected repositories yet.'

    return undefined
  }

  const disabledMessage = getDisabledMessage()

  return (
    <>
      <Tooltip label={disabledMessage} placement="top">
        <Button
          isDisabled={!!disabledMessage}
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
      </Tooltip>

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
