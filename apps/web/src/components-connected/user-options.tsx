import { Button, Flex, Skeleton, useDisclosure } from '@chakra-ui/react'

import { DeleteUserConfirmation } from 'src/components-connected/delete-user-confirmation'
import { UpdateUserDrawer } from 'src/components-connected/update-user-drawer'
import { routerPaths } from 'src/router'
import { storage } from 'src/storage'
import { trpc } from 'src/trpc'

export function UserOptions() {
  const {
    isOpen: isOpenUpdateDrawer,
    onOpen: onOpenUpdateDrawer,
    onClose: onCloseUpdateDrawer
  } = useDisclosure()
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal
  } = useDisclosure()
  const { data: user, isLoading: isLoadingUser } =
    trpc.users.getCurrentUser.useQuery()

  return (
    <>
      {isLoadingUser ? (
        <Flex gap={4}>
          <Skeleton display="inline-block">
            <Button>Update user</Button>
          </Skeleton>

          <Skeleton display="inline-block">
            <Button>Delete user</Button>
          </Skeleton>
        </Flex>
      ) : (
        <Flex gap={4}>
          <Button isDisabled={!user} onClick={onOpenUpdateDrawer}>
            Update user
          </Button>

          <Button
            isDisabled={!user}
            onClick={onOpenDeleteModal}
            colorScheme="red"
          >
            Delete user
          </Button>
        </Flex>
      )}
      <UpdateUserDrawer
        user={user}
        isOpen={isOpenUpdateDrawer}
        onClose={onCloseUpdateDrawer}
      />
      <DeleteUserConfirmation
        user={user}
        isOpen={isOpenDeleteModal}
        onCancel={() => {
          onCloseDeleteModal()
        }}
        onConfirm={() => {
          onCloseDeleteModal()
          storage.auth.removeToken()
          routerPaths.login.navigate()
        }}
      />
    </>
  )
}
