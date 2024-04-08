import { Box, Divider } from '@chakra-ui/react'

import { UserOptions } from 'src/components-connected/user-options'
import { ViewReminderSection } from 'src/components-connected/view-reminder-section'
import { ViewUserSection } from 'src/components-connected/view-user-section'

export function User() {
  return (
    <>
      <UserOptions />
      <Divider my={4} />
      <ViewUserSection />
      <Box mt={4}>
        <ViewReminderSection />
      </Box>
    </>
  )
}
