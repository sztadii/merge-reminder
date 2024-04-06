import { Card, CardBody, Skeleton } from '@chakra-ui/react'

import { Text } from 'src/components/text'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function ViewProjectSection() {
  const params = routerPaths.project.getParams()

  const { data: project, isLoading: isLoadingProject } =
    trpc.projects.getById.useQuery(params.id)

  return (
    <>
      <Card>
        <CardBody>
          {isLoadingProject && (
            <Text>
              <Skeleton display="inline">Loading</Skeleton>
            </Text>
          )}

          {!isLoadingProject && !project && (
            <Text>No projects with the {params.id} ID</Text>
          )}

          <Text>{project?.name}</Text>
        </CardBody>
      </Card>
    </>
  )
}
