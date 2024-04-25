import { Box } from '@chakra-ui/react'

import { BasicSettingsSection } from 'src/components-connected/sections/basic-settings-section'
import { EmailSection } from 'src/components-connected/sections/email-section'
import { Breadcrumbs } from 'src/components/breadcrumbs'

export function Settings() {
  return (
    <>
      <Box mb={4}>
        <Breadcrumbs currentPage="Settings" />
      </Box>

      <Box mb={4}>
        <EmailSection />
      </Box>

      <BasicSettingsSection />
    </>
  )
}
