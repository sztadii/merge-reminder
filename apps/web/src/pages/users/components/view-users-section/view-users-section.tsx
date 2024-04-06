import {
  Card,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useMemo } from 'react'

import { Icon } from 'src/components/icon'
import { SpinnerWithLabel } from 'src/components/spinner-with-label/spinner-with-label'
import { Table, TableProps } from 'src/components/table'
import { usePendingMutationVariables } from 'src/hooks/use-pending-mutations-variables'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function ViewUsersSection() {
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
                {user.login}
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
                  <MenuItem isDisabled>Edit</MenuItem>
                </MenuList>
              </Menu>
            )
          }
        }
      }
    ]
  }, [pendingMutationVariables])

  return (
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
  )
}
