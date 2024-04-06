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

import { Icon } from 'src/components/icon'
import { SpinnerWithLabel } from 'src/components/spinner-with-label/spinner-with-label'
import { Table, TableProps } from 'src/components/table'
import { usePendingMutationVariables } from 'src/hooks/use-pending-mutations-variables'
import { routerPaths } from 'src/router'
import { UserResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

import { CreateUpdateUserDrawer } from '../create-update-user-drawer'

export function ViewUsersSection() {
  const [user, setUser] = useState<UserResponse | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient()

  const pendingMutationVariables = usePendingMutationVariables()

  const { data: users = [], isLoading: isFetchingUserList } =
    trpc.users.findAll.useQuery()

  const { mutateAsync: deleteUser } = trpc.users.deleteById.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries(getQueryKey(trpc.users.findAll))
    },
    onError() {
      showErrorToast('Can not delete user')
    }
  })

  const tableColumns: TableProps<typeof users>['columns'] = useMemo(() => {
    return [
      {
        id: 'login',
        width: 600,
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
        width: 600,
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
        width: 200,
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
                  <MenuItem onClick={() => deleteUser(user.id)}>
                    Delete user
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setUser(user)
                      onOpen()
                    }}
                  >
                    Edit
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
        isOpen={isOpen}
        onClose={() => {
          setUser(undefined)
          onClose()
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
