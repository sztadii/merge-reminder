import { Box, Divider } from '@chakra-ui/react'

import { UserOptions } from 'src/components-connected/user-options'
import { ViewUserSection } from 'src/components-connected/view-user-section'
import { ViewWarningsSection } from 'src/components-connected/view-warnings-section'

export function User() {
  return (
    <>
      <UserOptions />
      <Divider my={4} />
      <ViewUserSection />
      <Box mt={4}>
        <ViewWarningsSection />
      </Box>
    </>
  )
}
