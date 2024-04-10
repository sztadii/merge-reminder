import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  useColorMode
} from '@chakra-ui/react'

import { Icon } from 'src/components/icon'
import { NavLink } from 'src/components/nav-link'
import { routerPaths } from 'src/router'
import { storage } from 'src/storage'

export function Navigation() {
  const { toggleColorMode, colorMode } = useColorMode()

  function logout() {
    storage.auth.removeToken()
    routerPaths.login.navigate()
  }

  return (
    <Box>
      <Flex p={4} alignItems="center" justifyContent="space-between">
        <NavLink href={routerPaths.users.path}>Merge Reminder</NavLink>

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
