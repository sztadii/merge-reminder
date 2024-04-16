import { Button, Flex, Skeleton, useDisclosure } from '@chakra-ui/react'

import { DeleteUserConfirmation } from 'src/components-connected/delete-user-confirmation'
import { logout } from 'src/helpers'
import { trpc } from 'src/trpc'

export function Actions() {
  const {
    isOpen: isOpenForDeleteModal,
    onOpen: onOpenForDeleteModal,
    onClose: onCloseForDeleteModal
  } = useDisclosure()
  const { data: user, isLoading: isLoadingForUser } =
    trpc.client.getCurrentUser.useQuery()

  return (
    <>
      {isLoadingForUser ? (
        <Flex gap={4}>
          <Skeleton display="inline-block">
            <Button>Delete profile</Button>
          </Skeleton>
        </Flex>
      ) : (
        <Flex gap={4}>
          <Button
            isDisabled={!user}
            onClick={onOpenForDeleteModal}
            colorScheme="red"
          >
            Delete profile
          </Button>
        </Flex>
      )}
      <DeleteUserConfirmation
        user={user}
        isOpen={isOpenForDeleteModal}
        onCancel={onCloseForDeleteModal}
        onConfirm={() => {
          onCloseForDeleteModal()
          logout()
        }}
      />
    </>
  )
}
