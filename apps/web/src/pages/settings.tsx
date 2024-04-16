import { Box } from '@chakra-ui/react'

import { BasicSettingsSection } from 'src/components-connected/sections/basic-settings-section'
import { EmailSection } from 'src/components-connected/sections/email-section'
import { PaymentSettingsSection } from 'src/components-connected/sections/payment-settings-section'
import { Breadcrumbs } from 'src/components/breadcrumbs'

export function Settings() {
  return (
    <>
      <Box>
        <Breadcrumbs currentPage="Settings" />
      </Box>

      <Box mt={4}>
        <EmailSection />
      </Box>

      <Box mt={4}>
        <PaymentSettingsSection />
      </Box>

      <Box mt={4}>
        <BasicSettingsSection />
      </Box>
    </>
  )
}
