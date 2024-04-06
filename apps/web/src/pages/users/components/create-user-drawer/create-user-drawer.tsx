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
  Select,
  useDisclosure
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

import { UserRole, UserRoleSchema } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function CreateUserDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isPending, setIsPending] = useState(false)
  const [login, setLogin] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [role, setRole] = useState<UserRole>()
  const queryClient = useQueryClient()
  const { mutateAsync: createUserMutation } = trpc.users.create.useMutation()

  const createUser = async () => {
    if (!login || !email || !role) return

    try {
      setIsPending(true)
      await createUserMutation({
        login,
        email,
        role
      })
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
      setLogin(undefined)
      setRole(undefined)
      setEmail(undefined)
      onClose()
    } catch {
      showErrorToast('Can not create user')
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
    <>
      <Button onClick={onOpen}>Create</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create new user</DrawerHeader>

          <DrawerBody>
            <FormControl>
              <FormLabel>Login</FormLabel>
              <Input
                placeholder="Type..."
                onChange={e => setLogin(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>User email</FormLabel>
              <Input
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
            <Button variant="outline" mr={2} onClick={onClose}>
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
    </>
  )
}
