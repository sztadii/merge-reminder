import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton
} from '@chakra-ui/react'
import { Link } from 'wouter'

import { logout } from 'src/helpers'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function Navigation() {
  const { data: user, isLoading } = trpc.client.getCurrentUser.useQuery()

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
              {isLoading ? (
                <Skeleton borderRadius="50%">
                  <Avatar size="sm" />
                </Skeleton>
              ) : (
                <Avatar size="sm" src={user?.avatarUrl} />
              )}
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
