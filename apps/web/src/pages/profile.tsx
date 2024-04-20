import { Box } from '@chakra-ui/react'

import { ProfileSection } from 'src/components-connected/sections/profile-section'
import { Breadcrumbs } from 'src/components/breadcrumbs'

export function Profile() {
  return (
    <>
      <Box mb={4}>
        <Breadcrumbs currentPage="Profile" />
      </Box>

      <ProfileSection />
    </>
  )
}
