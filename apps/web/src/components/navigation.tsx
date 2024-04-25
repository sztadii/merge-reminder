import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton
} from '@chakra-ui/react'
import { Link } from 'wouter'

import { ToggleThemeButton } from 'src/components-connected/buttons/toggle-theme-button'
import { Container } from 'src/components/container'
import { Icon } from 'src/components/icon'
import { logout } from 'src/helpers'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function Navigation() {
  const { data: user, isLoading } = trpc.client.getCurrentUser.useQuery()

  return (
    <Box>
      <Container>
        <Flex py={4} alignItems="center" justifyContent="space-between">
          <Link to={routerPaths.landing.path}>
            <Heading size="sm" color="gray.500">
              Merge Reminder
            </Heading>
          </Link>

          <Flex alignItems="center" gap={4}>
            <ToggleThemeButton />

            <IconButton
              icon={<Icon variant="settings" />}
              aria-label=""
              as={Link}
              to={routerPaths.settings.path}
            />

            <Menu>
              <Skeleton borderRadius="50%" isLoaded={!isLoading}>
                <MenuButton>
                  <Avatar size="sm" src={user?.avatarUrl} />
                </MenuButton>
              </Skeleton>

              <MenuList>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>

      <Divider />
    </Box>
  )
}
