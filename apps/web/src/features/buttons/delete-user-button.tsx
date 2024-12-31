import { Button, useDisclosure } from '@chakra-ui/react'

import { UserResponse } from '@apps/shared/schemas'

import { Confirmation } from '@apps/web/components/confirmation'
import { Icon } from '@apps/web/components/icon'
import { logout } from '@apps/web/helpers'
import { showErrorToast } from '@apps/web/toasts'
import { trpc } from '@apps/web/trpc'

type DeleteUserButtonProps = {
  user?: UserResponse
}

export function DeleteUserButton({ user }: DeleteUserButtonProps) {
  const { mutateAsync: removeCurrentAccountMutation, isLoading } =
    trpc.auth.removeCurrentAccount.useMutation()

  const {
    isOpen: isOpenForConfirmModal,
    onOpen: onOpenForConfirmModal,
    onClose: onCloseForConfirmModal
  } = useDisclosure()

  async function deleteUser() {
    if (!user) return

    onCloseForConfirmModal()

    try {
      await removeCurrentAccountMutation()
      logout()
    } catch {
      showErrorToast('Can not delete profile.')
    }
  }

  return (
    <>
      <Button
        isDisabled={!user}
        isLoading={isLoading}
        onClick={onOpenForConfirmModal}
        colorScheme="red"
        width={{
          base: '100%',
          md: 'auto'
        }}
        rightIcon={<Icon variant="delete" />}
      >
        Delete
      </Button>

      <Confirmation
        isOpen={isOpenForConfirmModal}
        onClose={onCloseForConfirmModal}
        title="Delete profile"
        description="Do you want to delete this profile?"
        confirmButton={{
          text: 'Delete',
          onClick: deleteUser
        }}
      />
    </>
  )
}
