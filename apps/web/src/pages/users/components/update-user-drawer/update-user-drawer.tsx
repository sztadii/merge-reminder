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
  Input,
  Select
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

export function UpdateUserDrawer({
  user,
  isOpen,
  onClose
}: UpdateUserDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [login, setLogin] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [role, setRole] = useState<UserRole>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateUserMutation } = trpc.users.update.useMutation()

  useEffect(() => {
    if (!user) return

    setLogin(user.login)
    setEmail(user.email)
    setRole(user.role)
  }, [user])

  const resetUserValues = () => {
    setLogin(undefined)
    setRole(undefined)
    setEmail(undefined)
  }

  const handleOnClose = () => {
    resetUserValues()
    onClose()
  }

  const createUser = async () => {
    if (!login || !email || !role || !user) return

    try {
      setIsPending(true)
      await updateUserMutation({
        id: user.id,
        login,
        email,
        role
      })
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
      handleOnClose()
    } catch {
      showErrorToast('Can not update user')
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

  const isSaveButtonDisabled = !login || !email || !role

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={handleOnClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create new user</DrawerHeader>

        <DrawerBody>
          <FormControl>
            <FormLabel>Login</FormLabel>
            <Input
              defaultValue={login}
              placeholder="Type..."
              onChange={e => setLogin(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>User email</FormLabel>
            <Input
              defaultValue={email}
              placeholder="Type..."
              onChange={e => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="Select option..."
              value={role}
              onChange={e => {
                setRole(e.target.value as UserRole)
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
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={2} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            isDisabled={isSaveButtonDisabled}
            onClick={createUser}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
