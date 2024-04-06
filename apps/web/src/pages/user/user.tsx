import { Box } from '@chakra-ui/react'

import { ViewReminderSection } from './components/view-reminder-section'
import { ViewUserSection } from './components/view-user-section'

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
