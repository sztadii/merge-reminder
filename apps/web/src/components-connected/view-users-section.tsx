import {
  Button,
  Card,
  CardBody,
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

  const { data: users = [], isLoading: isFetchingUserList } =
    trpc.users.findAll.useQuery()

  const tableColumns: TableProps<typeof users>['columns'] = useMemo(() => {
    return [
      {
        id: 'githubLogin',
        width: 300,
        rowCellSkeleton: () => <Skeleton>Loading</Skeleton>,
        headingCell: {
          content: () => 'User / organization name'
        },
        rowCell: {
          content: user => {
            const isCurrentUserDeleting = pendingMutationVariables.some(
              variable => variable === user.id
            )

            return (
              <Flex gap={2}>
                <Button
                  as={Link}
                  to={routerPaths.user.generateURL(user.id)}
                  variant="link"
                  rightIcon={<Icon variant="chevronRight" />}
                  isActive
                  size="sm"
                >
                  {user.userOrOrganizationName}
                </Button>

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
        width: 300,
        rowCellSkeleton: () => <Skeleton>Loading</Skeleton>,
        headingCell: {
          content: () => 'Email'
        },
        rowCell: {
          content: user => user.email
        }
      },
      {
        id: 'role',
        width: 300,
        rowCellSkeleton: () => <Skeleton>Loading</Skeleton>,
        headingCell: {
          content: () => 'Role'
        },
        rowCell: {
          content: user => user.role
        }
      },
      {
        id: 'options',
        textAlign: 'right',
        rowCellSkeleton: () => (
          <Skeleton display="inline-block">
            <Icon variant="chevronDown" size="sm" />
          </Skeleton>
        ),
        headingCell: {
          content: () => 'Options'
        },
        rowCell: {
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
            isLoading={isFetchingUserList}
            emptyRowsMessage="No users"
          />
        </CardBody>
      </Card>
    </>
  )
}
