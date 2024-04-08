import { Box, Button, Divider, Skeleton, useDisclosure } from '@chakra-ui/react'

import { CreateUpdateUserDrawer } from 'src/components-connected/create-update-user-drawer'
import { ViewReminderSection } from 'src/components-connected/view-reminder-section'
import { ViewUserSection } from 'src/components-connected/view-user-section'
import { useUserFromUrl } from 'src/hooks/use-user-from-url'

export function User() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: user, isLoading } = useUserFromUrl()

  return (
    <>
      {isLoading ? (
        <Skeleton display="inline-block">
          <Button>Update user</Button>
        </Skeleton>
      ) : (
        <Button isDisabled={!user} onClick={onOpen}>
          Update user
        </Button>
      )}
      <CreateUpdateUserDrawer user={user} isOpen={isOpen} onClose={onClose} />
      <Divider my={4} />
      <ViewUserSection />
      <Box mt={4}>
        <ViewReminderSection />
      </Box>
    </>
  )
}
