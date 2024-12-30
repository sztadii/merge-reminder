import { Box } from '@chakra-ui/react'

import { Breadcrumbs } from 'src/components/breadcrumbs'
import { BasicSettingsSection } from 'src/features/sections/basic-settings-section'
import { EmailSection } from 'src/features/sections/email-section'
import { PaymentSettingsSection } from 'src/features/sections/payment-settings-section'

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
