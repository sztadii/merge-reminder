import { Card, CardBody, Skeleton } from '@chakra-ui/react'

import { Text } from 'src/components/text'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function ViewUserSection() {
  const params = routerPaths.user.getParams()

  const { data: user, isLoading: isLoadingUser } = trpc.users.getById.useQuery(
    params.id
  )

  return (
    <>
      <Card>
        <CardBody>
          {isLoadingUser && (
            <Text>
              <Skeleton display="inline">Loading</Skeleton>
            </Text>
          )}

          {!isLoadingUser && !user && (
            <Text>No user with the {params.id} ID</Text>
          )}

          <div>
            <Text>{user?.login}</Text>
          </div>
          <div>
            <Text>{user?.email}</Text>
          </div>
          <div>
            <Text>{user?.githubAccessToken}</Text>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
