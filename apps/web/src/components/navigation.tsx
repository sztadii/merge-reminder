import { Box, Divider, Flex, IconButton, useColorMode } from '@chakra-ui/react'

import { Icon } from 'src/components/icon'
import { NavLink } from 'src/components/nav-link'
import { routerPaths } from 'src/router'

export function Navigation() {
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <Box>
      <Flex p={4} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={8}>
          <NavLink href={routerPaths.users.path}>Merge Reminder</NavLink>
        </Flex>

        <IconButton
          aria-label="toggle theme"
          size="sm"
          onClick={toggleColorMode}
          icon={<Icon variant={colorMode === 'light' ? 'moon' : 'sun'} />}
        />
      </Flex>

      <Divider />
    </Box>
  )
}
