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
  Switch,
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

export function UpdateUserDrawer({
  user,
  isOpen,
  onClose
}: UpdateUserDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [formValues, setFormValues] = useState<FormValuesInitial | undefined>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateUserMutation } = trpc.users.update.useMutation()

  const hasMissingFormValues =
    !formValues?.userOrOrganizationName ||
    !formValues?.email ||
    !formValues?.role ||
    !formValues?.githubAccessToken ||
    !formValues?.headBranch ||
    !formValues?.baseBranch

  useEffect(() => {
    if (!user) return

    setFormValues(user)
  }, [user])

  async function updateUser() {
    if (!user) return
    if (hasMissingFormValues) return

    const formValuesToSend = {
      ...formValues,
      isOrganization: !!formValues?.isOrganization
    } as FormValuesRequired

    try {
      setIsPending(true)

      await updateUserMutation({
        ...formValuesToSend,
        id: user.id
      })

      // TODO Maybe move it outside
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
      await queryClient.invalidateQueries(getQueryKey(trpc.users.getById))
      queryClient
        .invalidateQueries(getQueryKey(trpc.warnings.getWarnings))
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
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
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
            <FormLabel>User / organization name</FormLabel>
            <Input
              value={formValues?.userOrOrganizationName}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  userOrOrganizationName: e.target.value
                })
              }
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Is organization</FormLabel>
            <Switch
              size="lg"
              isChecked={formValues?.isOrganization}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  isOrganization: e.target.checked
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
