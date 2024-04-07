import { Box } from '@chakra-ui/react'

import { ViewReminderSection } from 'src/components-connected/view-reminder-section'
import { ViewUserSection } from 'src/components-connected/view-user-section'

export function User() {
  return (
    <>
      <ViewUserSection />
      <Box mt={4}>
        <ViewReminderSection />
      </Box>
    </>
  )
}
