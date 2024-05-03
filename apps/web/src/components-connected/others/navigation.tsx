import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Skeleton,
  Tag,
  useColorMode
} from '@chakra-ui/react'
import { Link } from 'wouter'

import { Container } from 'src/components/container'
import { Icon } from 'src/components/icon'
import { logout } from 'src/helpers'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function Navigation() {
  const { data: user, isLoading } = trpc.client.getCurrentUser.useQuery()
  const { toggleColorMode, colorMode } = useColorMode()

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
            {user?.isActiveFreeTrial && (
              <Button
                size="xs"
                colorScheme="teal"
                onClick={() => {
                  routerPaths.settings.navigate()
                }}
              >
                Free trial ends in {user.countOfFreeTrialDays} days
              </Button>
            )}
            {user?.isActiveSubscription === false && (
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => {
                  routerPaths.settings.navigate()
                }}
              >
                Free trial ended
              </Button>
            )}
            <Menu>
              <Skeleton borderRadius="50%" isLoaded={!isLoading}>
                <MenuButton>
                  <Avatar size="sm" src={user?.avatarUrl} />
                </MenuButton>
              </Skeleton>

              <MenuList>
                <MenuItem
                  icon={
                    <Icon variant={colorMode === 'light' ? 'moon' : 'sun'} />
                  }
                  onClick={toggleColorMode}
                >
                  {colorMode === 'light' ? 'Dark theme' : 'Light theme'}
                </MenuItem>

                <MenuItem
                  icon={<Icon variant="settings" />}
                  as={Link}
                  to={routerPaths.settings.path}
                >
                  Settings
                </MenuItem>

                <MenuDivider />

                <MenuItem icon={<Icon variant="lock" />} onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>

      <Divider />
    </Box>
  )
}
