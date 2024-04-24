import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { Drawer } from 'src/components/drawer'
import { isValidEmail, trimObjectValues } from 'src/helpers'
import { UserResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type UpdateUserDrawerProps = {
  user?: UserResponse
  isOpen: boolean
  onClose: () => void
}

export function UpdateEmailDrawer({
  user,
  isOpen,
  onClose
}: UpdateUserDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [email, setEmail] = useState<string | undefined>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateEmailMutation } =
    trpc.client.updateCurrentEmail.useMutation()

  const hasCorrectEmail = !!email?.length && isValidEmail(email)

  useEffect(() => {
    if (!user) return

    setEmail(user?.email)
  }, [user, isOpen])

  async function updateUser() {
    if (!user) return
    if (!hasCorrectEmail) return

    try {
      setIsPending(true)

      await updateEmailMutation({
        email: trimObjectValues(email)
      })

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )

      setEmail(undefined)

      handleClose()
    } catch {
      showErrorToast('Can not update profile.')
    } finally {
      setIsPending(false)
    }
  }

  function handleClose() {
    setEmail(undefined)
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
              value={email || ''}
              placeholder="Type..."
              onChange={e => setEmail(e.target.value)}
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
            isDisabled={!hasCorrectEmail}
            onClick={updateUser}
          >
            Save
          </Button>
        </Flex>
      }
    />
  )
}
