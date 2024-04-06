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

export function CreateUpdateUserDrawer({
  user,
  isOpen,
  onClose
}: UpdateUserDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [login, setLogin] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [role, setRole] = useState<UserRole>()
  const [githubAccessToken, setGithubAccessToken] = useState<string>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateUserMutation } = trpc.users.update.useMutation()
  const { mutateAsync: createUserMutation } = trpc.users.create.useMutation()

  useEffect(() => {
    if (!user) return

    setLogin(user.login)
    setEmail(user.email)
    setRole(user.role)
    setGithubAccessToken(user.githubAccessToken)
  }, [user])

  const resetUserValues = () => {
    setLogin(undefined)
    setRole(undefined)
    setEmail(undefined)
    setGithubAccessToken(undefined)
  }

  const handleOnClose = () => {
    resetUserValues()
    onClose()
  }

  const createUser = async () => {
    if (!login || !email || !role || !githubAccessToken) return

    try {
      setIsPending(true)

      user
        ? await updateUserMutation({
            id: user.id,
            login,
            email,
            role,
            githubAccessToken
          })
        : await createUserMutation({
            login,
            email,
            role,
            githubAccessToken
          })
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
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

  const isSaveButtonDisabled = !login || !email || !role

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={handleOnClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{user ? 'Update user' : 'Create user'}</DrawerHeader>

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

          <FormControl mt={4}>
            <FormLabel>Github access token</FormLabel>
            <Input
              defaultValue={githubAccessToken}
              placeholder="Type..."
              onChange={e => setGithubAccessToken(e.target.value)}
            />
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
