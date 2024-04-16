import { Box, Button } from '@chakra-ui/react'
import { Link } from 'wouter'

import { BasicSettingsSection } from 'src/components-connected/basic-settings-section'
import { Icon } from 'src/components/icon'
import { routerPaths } from 'src/router'

export function Settings() {
  return (
    <>
      <Box mb={4}>
        <Button
          as={Link}
          to={routerPaths.profile.path}
          leftIcon={<Icon variant="chevronLeft" />}
        >
          Back to profile
        </Button>
      </Box>

      <BasicSettingsSection />
    </>
  )
}
