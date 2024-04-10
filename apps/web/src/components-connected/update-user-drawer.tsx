import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

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
    trpc.users.updateCurrentUser.useMutation()

  const hasMissingFormValues =
    !formValues?.email || !formValues?.headBranch || !formValues?.baseBranch

  useEffect(() => {
    if (!user) return

    setFormValues(user)
  }, [user])

  async function updateUser() {
    if (!user) return
    if (hasMissingFormValues) return

    try {
      setIsPending(true)

      await updateUserMutation(formValues as FormValuesRequired)

      await queryClient.invalidateQueries(
        getQueryKey(trpc.users.getCurrentUser)
      )
      queryClient
        .invalidateQueries(getQueryKey(trpc.warnings.getCurrentWarnings))
        .then()

      onClose()
      setFormValues(undefined)
    } catch {
      const message = user ? 'Can not update user' : 'Can not create user'
      showErrorToast(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Update user</DrawerHeader>

        <DrawerBody>
          <FormControl mt={4}>
            <FormLabel>User email</FormLabel>
            <Input
              value={formValues?.email}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  email: e.target.value
                })
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Head branch</FormLabel>
            <Input
              value={formValues?.headBranch}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  headBranch: e.target.value
                })
              }
            />

            <FormHelperText>Usually the production branch:</FormHelperText>

            <Flex alignItems="center" gap={2} mt={2}>
              <Button
                size="xs"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    headBranch: 'master'
                  })
                }}
              >
                master
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    headBranch: 'main'
                  })
                }}
              >
                main
              </Button>
            </Flex>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Base branch</FormLabel>
            <Input
              value={formValues?.baseBranch}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  baseBranch: e.target.value
                })
              }
            />

            <FormHelperText>Usually the development branch:</FormHelperText>

            <Flex alignItems="center" gap={2} mt={2}>
              <Button
                size="xs"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    baseBranch: 'develop'
                  })
                }}
              >
                develop
              </Button>
            </Flex>
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
