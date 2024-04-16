import { Box } from '@chakra-ui/react'

import { ViewUserDetails } from 'src/components-connected/view-user-details'
import { ViewWarningsSection } from 'src/components-connected/view-warnings-section'

export function User() {
  return (
    <>
      <ViewUserDetails />
      <Box mt={4}>
        <ViewWarningsSection />
      </Box>
    </>
  )
}
