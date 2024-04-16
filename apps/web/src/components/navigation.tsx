import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react'
import { Link } from 'wouter'

import { logout } from 'src/helpers'
import { routerPaths } from 'src/router'

export function Navigation() {
  return (
    <Box>
      <Flex p={4} alignItems="center" justifyContent="space-between">
        <Link to={routerPaths.profile.path}>
          <Heading size="sm" color="gray.500">
            Merge Reminder
          </Heading>
        </Link>

        <Flex alignItems="center" gap={4}>
          <Menu>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to={routerPaths.settings.path}>
                Settings
              </MenuItem>

              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Divider />
    </Box>
  )
}
