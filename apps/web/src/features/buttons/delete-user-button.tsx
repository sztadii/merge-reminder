import { Button, useDisclosure } from '@chakra-ui/react'

import { Confirmation } from 'src/components/confirmation'
import { Icon } from 'src/components/icon'
import { logout } from 'src/helpers'
import { UserResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

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
