import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { Confirmation } from 'src/components/confirmation'
import { Text } from 'src/components/text'
import { UserResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type DeleteUserConfirmationProps = {
  user?: UserResponse
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteUserConfirmation({
  user,
  isOpen,
  onCancel,
  onConfirm
}: DeleteUserConfirmationProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteUserMutation } =
    trpc.users.deleteById.useMutation()

  const deleteUser = async () => {
    if (!user) return

    onConfirm()

    try {
      await deleteUserMutation(user.id)
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
      await queryClient.invalidateQueries(
        getQueryKey(trpc.users.getById, user.id)
      )
    } catch {
      showErrorToast('Can not delete user')
    }
  }

  return (
    <Confirmation
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete user"
      description={
        <>
          Are you sure you want delete{' '}
          <Text fontWeight={700}>{user?.githubLogin}</Text>?
        </>
      }
      confirmButton={{
        name: 'Delete',
        onClick: deleteUser,
        colorScheme: 'red'
      }}
    />
  )
}
