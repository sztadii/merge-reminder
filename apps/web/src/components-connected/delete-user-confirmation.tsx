import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

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
  const [githubLoginConfirmation, setGithubLoginConfirmation] = useState<
    string | undefined
  >()

  const isDeletionConfirmed = githubLoginConfirmation === user?.githubLogin
  const queryClient = useQueryClient()

  const { mutateAsync: deleteUserMutation } =
    trpc.users.deleteById.useMutation()

  const handleClose = () => {
    setGithubLoginConfirmation(undefined)
    onCancel()
  }

  const handleConfirm = () => {
    setGithubLoginConfirmation(undefined)
    onConfirm()
  }

  const deleteUser = async () => {
    if (!user || !isDeletionConfirmed) return

    handleConfirm()

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
      onClose={handleClose}
      title="Delete user"
      description={
        <>
          <FormControl>
            <FormLabel>
              If you are sure about deletion, <br />
              then please type <Text fontWeight={700}>
                {user?.githubLogin}
              </Text>{' '}
              below.
            </FormLabel>
            <Input
              value={githubLoginConfirmation}
              placeholder="Type..."
              onChange={e => setGithubLoginConfirmation(e.target.value)}
            />
          </FormControl>
        </>
      }
      confirmButton={{
        name: 'Delete',
        onClick: deleteUser,
        colorScheme: 'red',
        isDisabled: !isDeletionConfirmed
      }}
    />
  )
}
