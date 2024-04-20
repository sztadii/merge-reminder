import { Box } from '@chakra-ui/react'

import { RepositoriesSection } from 'src/components-connected/repositories-section'
import { ViewUserDetails } from 'src/components-connected/view-user-details'
import { ViewWarningsSection } from 'src/components-connected/view-warnings-section'

export function Dashboard() {
  return (
    <>
      <ViewUserDetails />
      <Box mt={4}>
        <ViewWarningsSection />
      </Box>
      <Box mt={4}>
        <RepositoriesSection />
      </Box>
    </>
  )
}
