import { Box, Card, CardBody, Skeleton } from '@chakra-ui/react'

import { SpinnerWithLabel } from 'src/components/spinner-with-label'
import { Text } from 'src/components/text'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function ViewWarningsSection() {
  const params = routerPaths.user.getParams()

  const {
    data: warnings,
    isLoading: isLoadingWarnings,
    error: errorForWarnings,
    isFetching: isFetchingWarnings
  } = trpc.warnings.getWarnings.useQuery(params.id)

  return (
    <>
      <Card>
        <CardBody>
          {isLoadingWarnings && (
            <Text>
              <Skeleton display="inline-block" width={400}>
                Loading
              </Skeleton>
            </Text>
          )}

          {errorForWarnings && <Text>{errorForWarnings.message}</Text>}

          {warnings && (
            <Text>
              {isFetchingWarnings && (
                <SpinnerWithLabel label="Fetching the latest warnings" />
              )}

              {warnings.length === 0 && (
                <div>All your repos are looking well. Good job team!</div>
              )}

              {warnings.map(e => {
                return (
                  <Box key={e.repo}>
                    <div>{e.repo}</div>
                    <div>{e.delayInHours}</div>
                    <div>{e.commits.length}</div>
                    <div>{e.authors.toString()}</div>
                  </Box>
                )
              })}
            </Text>
          )}
        </CardBody>
      </Card>
    </>
  )
}
