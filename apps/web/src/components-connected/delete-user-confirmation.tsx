import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue
} from '@chakra-ui/react'
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
  const [userOrOrganizationName, setUserOrOrganizationName] = useState('')

  const isDeletionConfirmed = userOrOrganizationName === 'confirm'

  const { mutateAsync: removeCurrentAccountMutation } =
    trpc.client.removeCurrentAccount.useMutation()

  const dangerColor = useColorModeValue('red.500', 'red.200')

  function handleCancel() {
    setUserOrOrganizationName('')
    onCancel()
  }

  async function deleteUser() {
    if (!user || !isDeletionConfirmed) return

    try {
      await removeCurrentAccountMutation()
      setUserOrOrganizationName('')
      onConfirm()
    } catch {
      showErrorToast('Can not delete profile')
    }
  }

  return (
    <Confirmation
      isOpen={isOpen}
      onClose={handleCancel}
      title="Delete profile"
      description={
        <>
          <FormControl>
            <FormLabel>
              If you are sure about deletion, <br />
              then please type{' '}
              <Text fontWeight="bold" color={dangerColor}>
                confirm
              </Text>{' '}
              below.
            </FormLabel>
            <Input
              value={userOrOrganizationName}
              placeholder="Type..."
              onChange={e => setUserOrOrganizationName(e.target.value)}
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
