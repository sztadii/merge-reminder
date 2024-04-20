import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { trimObjectValues } from 'src/helpers'
import { UserResponse, UserUpdateRequest } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type UpdateUserDrawerProps = {
  user?: UserResponse
  isOpen: boolean
  onClose: () => void
}

type FormValuesRequired = UserUpdateRequest

type FormValuesInitial = Partial<FormValuesRequired>

export function UpdateUserDrawer({
  user,
  isOpen,
  onClose
}: UpdateUserDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [formValues, setFormValues] = useState<FormValuesInitial | undefined>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateUserMutation } =
    trpc.client.updateCurrentUser.useMutation()

  const hasMissingFormValues = !formValues?.email

  useEffect(() => {
    if (!user) return

    setFormValues(user)
  }, [user])

  async function updateUser() {
    if (!user) return
    if (hasMissingFormValues) return

    try {
      setIsPending(true)

      const trimmedValues = trimObjectValues(formValues)
      await updateUserMutation(trimmedValues as FormValuesRequired)

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )

      onClose()
      setFormValues(undefined)
    } catch {
      showErrorToast('Can not update profile.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Update profile</DrawerHeader>

        <DrawerBody>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={formValues?.email || ''}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  email: e.target.value
                })
              }
            />
          </FormControl>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={2} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            isDisabled={hasMissingFormValues}
            onClick={updateUser}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
