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
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'wouter'

import { Confirmation } from 'src/components/confirmation'
import { Icon } from 'src/components/icon'
import { SpinnerWithLabel } from 'src/components/spinner-with-label/spinner-with-label'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
import { usePendingMutationVariables } from 'src/hooks/use-pending-mutations-variables'
import { routerPaths } from 'src/router'
import { UserResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

import { CreateUpdateUserDrawer } from '../create-update-user-drawer'

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

  const queryClient = useQueryClient()

  const pendingMutationVariables = usePendingMutationVariables()

  const { data: users = [], isLoading: isFetchingUserList } =
    trpc.users.findAll.useQuery()

  const { mutateAsync: deleteUserMutation } =
    trpc.users.deleteById.useMutation()

  const deleteUser = async () => {
    if (!user) return

    onCloseDeleteConfirmation()

    try {
      await deleteUserMutation(user.id)
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
    } catch {
      showErrorToast('Can not delete user')
    }
  }

  const tableColumns: TableProps<typeof users>['columns'] = useMemo(() => {
    return [
      {
        id: 'login',
        width: 300,
        rowCellSkeleton: () => <Skeleton>Loading</Skeleton>,
        headingCell: {
          content: () => 'Login'
        },
        rowCell: {
          content: user => {
            const isCurrentUserDeleting = pendingMutationVariables.some(
              variable => variable === user.id
            )

            return (
              <Flex gap={2}>
                <Button
                  mt={1}
                  as={Link}
                  to={routerPaths.user.generateURL(user.id)}
                  variant="link"
                  rightIcon={<Icon variant="chevronRight" />}
                  isActive
                >
                  {user.login}
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
        id: 'githubOrganization',
        width: 300,
        rowCellSkeleton: () => <Skeleton>Loading</Skeleton>,
        headingCell: {
          content: () => 'Github organization'
        },
        rowCell: {
          content: user => user.githubOrganization
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
                    Edit
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setUser(user)
                      onOpenDeleteConfirmation()
                    }}
                  >
                    Delete user
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

      <Confirmation
        isOpen={isOpenDeleteConfirmation}
        onClose={() => {
          setUser(undefined)
          onCloseDeleteConfirmation()
        }}
        title="Delete"
        description={
          <>
            Are you sure you want delete{' '}
            <Text fontWeight={700}>{user?.login}</Text>?
          </>
        }
        confirmButton={{
          name: 'Delete',
          onClick: deleteUser,
          colorScheme: 'red'
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
