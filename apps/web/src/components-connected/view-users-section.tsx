import {
  Card,
  CardBody,
  Link as ChakraLink,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { Link } from 'wouter'

import { Icon } from 'src/components/icon'
import { SpinnerWithLabel } from 'src/components/spinner-with-label'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
import { usePendingMutationVariables } from 'src/hooks/use-pending-mutations-variables'
import { routerPaths } from 'src/router'
import { UserResponse } from 'src/schemas'
import { trpc } from 'src/trpc'

import { CreateUpdateUserDrawer } from './create-update-user-drawer'
import { DeleteUserConfirmation } from './delete-user-confirmation'

export function ViewUsersSection() {
  const [user, setUser] = useState<UserResponse | undefined>()

  const {
    isOpen: isOpenCreateUpdateDrawer,
    onOpen: onOpenCreateUpdateDrawer,
    onClose: onCloseCreateUpdateDrawer
  } = useDisclosure()

  const {
    isOpen: isOpenDeleteConfirmation,
    onOpen: onOpenDeleteConfirmation,
    onClose: onCloseDeleteConfirmation
  } = useDisclosure()

  const pendingMutationVariables = usePendingMutationVariables()

  const {
    data: users = [],
    isLoading: isFetchingUserList,
    error: errorForUserList
  } = trpc.users.findAll.useQuery()

  const tableColumns: TableProps<typeof users>['columns'] = useMemo(() => {
    return [
      {
        id: 'githubLogin',
        headingCell: {
          skeleton: () => (
            <Skeleton display="inline-block">User / organization name</Skeleton>
          ),
          content: () => 'User / organization name'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: user => {
            const isCurrentUserDeleting = pendingMutationVariables.some(
              variable => variable === user.id
            )

            return (
              <Flex gap={2} alignItems="center">
                <ChakraLink
                  as={Link}
                  to={routerPaths.user.generateURL(user.id)}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  {user.userOrOrganizationName}

                  <Icon variant="chevronRight" />
                </ChakraLink>

                {isCurrentUserDeleting && (
                  <SpinnerWithLabel label="Deleting" color="red.400" />
                )}
              </Flex>
            )
          }
        }
      },
      {
        id: 'email',
        headingCell: {
          skeleton: () => <Skeleton display="inline-block">Email</Skeleton>,
          content: () => 'Email'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: user => user.email
        }
      },
      {
        id: 'role',
        headingCell: {
          skeleton: () => <Skeleton display="inline-block">Role</Skeleton>,
          content: () => 'Role'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: user => user.role
        }
      },
      {
        id: 'options',
        textAlign: 'right',
        headingCell: {
          skeleton: () => <Skeleton display="inline-block">Options</Skeleton>,
          content: () => 'Options'
        },
        rowCell: {
          skeleton: () => (
            <Skeleton display="inline-block">
              <Icon variant="chevronDown" size="sm" />
            </Skeleton>
          ),
          content: user => {
            return (
              <Menu placement="left-start">
                <MenuButton>
                  <Icon variant="chevronDown" size="sm" />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setUser(user)
                      onOpenCreateUpdateDrawer()
                    }}
                  >
                    Update user
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setUser(user)
                      onOpenDeleteConfirmation()
                    }}
                  >
                    <Text color="red">Delete user</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            )
          }
        }
      }
    ]
  }, [pendingMutationVariables])

  return (
    <>
      <CreateUpdateUserDrawer
        user={user}
        isOpen={isOpenCreateUpdateDrawer}
        onClose={() => {
          setUser(undefined)
          onCloseCreateUpdateDrawer()
        }}
      />

      <DeleteUserConfirmation
        user={user}
        isOpen={isOpenDeleteConfirmation}
        onCancel={() => {
          setUser(undefined)
          onCloseDeleteConfirmation()
        }}
        onConfirm={() => {
          setUser(undefined)
          onCloseDeleteConfirmation()
        }}
      />

      <Card>
        <CardBody>
          <Table
            columns={tableColumns}
            rows={users}
            skeletonRows={8}
            isLoading={isFetchingUserList}
            errorMessage={errorForUserList?.message}
            noDataMessage="No users"
          />
        </CardBody>
      </Card>
    </>
  )
}
