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
  Select,
  Tag,
  Textarea
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { UserResponse, UserRole, UserRoleSchema } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type UpdateUserDrawerProps = {
  user?: UserResponse
  isOpen: boolean
  onClose: () => void
}

type FormValuesRequired = Omit<UserResponse, 'id' | 'createdAt' | 'updatedAt'>
type FormValuesInitial = Partial<FormValuesRequired>

export function CreateUpdateUserDrawer({
  user,
  isOpen,
  onClose
}: UpdateUserDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [formValues, setFormValues] = useState<FormValuesInitial | undefined>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateUserMutation } = trpc.users.update.useMutation()
  const { mutateAsync: createUserMutation } = trpc.users.create.useMutation()

  const hasMissingFormValues =
    !formValues?.githubLogin ||
    !formValues?.email ||
    !formValues?.role ||
    !formValues?.githubAccessToken ||
    !formValues?.githubOrganization ||
    !formValues?.headBranch ||
    !formValues?.baseBranch

  useEffect(() => {
    if (!user) return

    setFormValues(user)
  }, [user])

  const resetUserValues = () => {
    setFormValues(undefined)
  }

  const handleOnClose = () => {
    resetUserValues()
    onClose()
  }

  const createUser = async () => {
    if (hasMissingFormValues) return

    const formValuesToSend = formValues as FormValuesRequired

    try {
      setIsPending(true)

      user
        ? await updateUserMutation({
            ...formValuesToSend,
            id: user.id
          })
        : await createUserMutation(formValuesToSend)

      // TODO Maybe move it outside
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
      await queryClient.invalidateQueries(getQueryKey(trpc.users.getById))
      queryClient
        .invalidateQueries(getQueryKey(trpc.reminders.getReminder))
        .then()

      handleOnClose()
    } catch {
      const message = user ? 'Can not update user' : 'Can not create user'
      showErrorToast(message)
    } finally {
      setIsPending(false)
    }
  }

  const selectOptions = [
    {
      name: 'Admin',
      value: UserRoleSchema.enum.ADMIN
    },
    {
      name: 'Client',
      value: UserRoleSchema.enum.CLIENT
    }
  ]

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={handleOnClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{user ? 'Update user' : 'Create user'}</DrawerHeader>

        <DrawerBody>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Select option..."
              value={formValues?.role}
              onChange={e => {
                setFormValues({
                  ...formValues,
                  role: e.target.value as UserRole
                })
              }}
            >
              {selectOptions.map(option => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                )
              })}
            </Select>
          </FormControl>

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
            <FormLabel>Github login</FormLabel>
            <Input
              value={formValues?.githubLogin}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  githubLogin: e.target.value
                })
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Github access token</FormLabel>
            <Textarea
              value={formValues?.githubAccessToken}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  githubAccessToken: e.target.value
                })
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Github organization</FormLabel>
            <Input
              value={formValues?.githubOrganization}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  githubOrganization: e.target.value
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
          <Button variant="outline" mr={2} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            isDisabled={hasMissingFormValues}
            onClick={createUser}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
