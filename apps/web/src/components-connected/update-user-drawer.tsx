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
  Input,
  Switch
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

      const trimmedValues = trimObjectValues(formValues)
      await updateUserMutation(trimmedValues as FormValuesRequired)

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentUser)
      )

      queryClient
        .invalidateQueries(getQueryKey(trpc.client.getCurrentWarnings))
        .then()

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

          <FormControl mt={8}>
            <FormLabel>Head branch</FormLabel>
            <Input
              value={formValues?.headBranch || ''}
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

          <FormControl mt={8}>
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

          <FormControl mt={8}>
            <FormLabel>Exclude repos without required branches</FormLabel>
            <Switch
              size="lg"
              isChecked={formValues?.excludeReposWithoutRequiredBranches}
              onChange={e =>
                setFormValues({
                  ...formValues,
                  excludeReposWithoutRequiredBranches: e.target.checked
                })
              }
            />

            <FormHelperText>Helpful during the initial setup</FormHelperText>
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
