import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { Drawer } from 'src/components/drawer'
import { isValidEmail, trimObjectValues } from 'src/helpers'
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

  const hasCorrectData =
    !!formValues?.email?.length && isValidEmail(formValues?.email)

  useEffect(() => {
    if (!user) return

    setFormValues(user)
  }, [user, isOpen])

  async function updateUser() {
    if (!user) return
    if (!hasCorrectData) return

    try {
      setIsPending(true)

      const trimmedValues = trimObjectValues(formValues)
      await updateUserMutation(trimmedValues as FormValuesRequired)

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )

      setFormValues(undefined)

      handleClose()
    } catch {
      showErrorToast('Can not update profile.')
    } finally {
      setIsPending(false)
    }
  }

  function handleClose() {
    setFormValues(undefined)
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      header={<>Update profile</>}
      body={
        <>
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
        </>
      }
      footer={
        <Flex>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            ml={2}
            isLoading={isPending}
            isDisabled={!hasCorrectData}
            onClick={updateUser}
          >
            Save
          </Button>
        </Flex>
      }
    />
  )
}
