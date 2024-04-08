import {
  Box,
  Button,
  Divider,
  Flex,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react'

import { CreateUpdateUserDrawer } from 'src/components-connected/create-update-user-drawer'
import { DeleteUserConfirmation } from 'src/components-connected/delete-user-confirmation'
import { ViewReminderSection } from 'src/components-connected/view-reminder-section'
import { ViewUserSection } from 'src/components-connected/view-user-section'
import { useNavigate } from 'src/hooks/use-navigate'
import { useUserFromUrl } from 'src/hooks/use-user-from-url'
import { routerPaths } from 'src/router'

export function User() {
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
  const { data: user, isLoading } = useUserFromUrl()
  const navigate = useNavigate()

  return (
    <>
      {isLoading ? (
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

          <Button isDisabled={!user} onClick={onOpenDeleteModal}>
            Delete user
          </Button>
        </Flex>
      )}
      <CreateUpdateUserDrawer
        user={user}
        isOpen={isOpenUpdateDrawer}
        onClose={onCloseUpdateDrawer}
      />
      <DeleteUserConfirmation
        user={user}
        isOpen={isOpenDeleteModal}
        onClose={() => {
          onCloseDeleteModal()

          // TODO based on the user role we should redirect somewhere
          // Admin should be redirected to routerPaths.users.path
          // Other users should be redirected to login page
          navigate(routerPaths.users.path)
        }}
      />
      <Divider my={4} />
      <ViewUserSection />
      <Box mt={4}>
        <ViewReminderSection />
      </Box>
    </>
  )
}
