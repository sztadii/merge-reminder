import { Box, Divider } from '@chakra-ui/react'

import { Actions } from 'src/components-connected/actions'
import { ViewUserDetails } from 'src/components-connected/view-user-details'
import { ViewWarningsSection } from 'src/components-connected/view-warnings-section'

export function User() {
  return (
    <>
      <Actions />
      <Divider my={4} />
      <ViewUserDetails />
      <Box mt={4}>
        <ViewWarningsSection />
      </Box>
    </>
  )
}
