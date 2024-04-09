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
                <Box mb={2}>
                  <SpinnerWithLabel label="Fetching the latest warnings" />
                </Box>
              )}

              {warnings.length === 0 && (
                <div>All your repos are looking well. Good job team!</div>
              )}

              {warnings.map(e => {
                return (
                  <Box key={e.repo}>
                    <Box mb={2}>
                      <Box mb={1}>
                        <Text fontSize="xs" color="gray.400">
                          Repo:
                        </Text>
                      </Box>
                      <Text>{e.repo}</Text>
                    </Box>

                    <Box mb={2}>
                      <Box mb={1}>
                        <Text fontSize="xs" color="gray.400">
                          Delay ( hours ):
                        </Text>
                      </Box>
                      <Text>{e.delayInHours}</Text>
                    </Box>

                    <Box mb={2}>
                      <Box mb={1}>
                        <Text fontSize="xs" color="gray.400">
                          Commits:
                        </Text>
                      </Box>
                      <Text>{e.commits.toString()}</Text>
                    </Box>

                    <Box mb={2}>
                      <Box mb={1}>
                        <Text fontSize="xs" color="gray.400">
                          Authors:
                        </Text>
                      </Box>
                      <Text>{e.authors.toString()}</Text>
                    </Box>
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
