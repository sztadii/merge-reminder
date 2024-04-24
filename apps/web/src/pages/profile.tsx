import { Box } from '@chakra-ui/react'

import { EmailSection } from 'src/components-connected/sections/email-section'
import { Breadcrumbs } from 'src/components/breadcrumbs'

export function Profile() {
  return (
    <>
      <Box mb={4}>
        <Breadcrumbs currentPage="Profile" />
      </Box>

      <EmailSection />
    </>
  )
}
