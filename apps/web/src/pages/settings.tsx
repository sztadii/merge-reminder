import { Box } from '@chakra-ui/react'

import { Breadcrumbs } from '@apps/web/components/breadcrumbs'
import { BasicSettingsSection } from '@apps/web/features/sections/basic-settings-section'
import { EmailSection } from '@apps/web/features/sections/email-section'
import { PaymentSettingsSection } from '@apps/web/features/sections/payment-settings-section'

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
