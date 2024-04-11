import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  useColorMode
} from '@chakra-ui/react'

import { Icon } from 'src/components/icon'
import { logout } from 'src/helpers'

export function Navigation() {
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <Box>
      <Flex p={4} alignItems="center" justifyContent="space-between">
        <div>Merge Reminder</div>

        <Flex alignItems="center" gap={4}>
          <Button size="sm" onClick={logout}>
            Logout
          </Button>

          <IconButton
            aria-label="toggle theme"
            size="sm"
            onClick={toggleColorMode}
            icon={<Icon variant={colorMode === 'light' ? 'moon' : 'sun'} />}
          />
        </Flex>
      </Flex>

      <Divider />
    </Box>
  )
}
