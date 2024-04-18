import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { useState } from 'react'

import { Confirmation } from 'src/components/confirmation'
import { Text } from 'src/components/text'
import { logout } from 'src/helpers'
import { UserResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type DeleteUserButtonProps = {
  user?: UserResponse
}

export function DeleteUserButton({ user }: DeleteUserButtonProps) {
  const { mutateAsync: removeCurrentAccountMutation } =
    trpc.client.removeCurrentAccount.useMutation()

  const [userOrOrganizationName, setUserOrOrganizationName] = useState('')

  const {
    isOpen: isOpenForDeleteModal,
    onOpen: onOpenForDeleteModal,
    onClose: onCloseForDeleteModal
  } = useDisclosure()

  const dangerColor = useColorModeValue('red.500', 'red.200')

  const confirmText = 'confirm'
  const isDeletionConfirmed = userOrOrganizationName === confirmText

  function handleCancel() {
    setUserOrOrganizationName('')
    onCloseForDeleteModal()
  }

  async function deleteUser() {
    if (!user || !isDeletionConfirmed) return

    try {
      await removeCurrentAccountMutation()
      onCloseForDeleteModal()
      logout()
    } catch {
      showErrorToast('Can not delete profile.')
    }
  }

  return (
    <>
      <Button
        isDisabled={!user}
        onClick={onOpenForDeleteModal}
        colorScheme="red"
      >
        Delete
      </Button>

      <Confirmation
        isOpen={isOpenForDeleteModal}
        onClose={handleCancel}
        title="Delete profile"
        description={
          <>
            <FormControl>
              <FormLabel>
                If you are sure about deletion, <br />
                then please type{' '}
                <Text fontWeight="bold" color={dangerColor}>
                  {confirmText}
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
    </>
  )
}
