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

          {user && (
            <Text>
              {user.githubLogin} {user.email} {user.githubAccessToken}
            </Text>
          )}
        </CardBody>
      </Card>
    </>
  )
}
