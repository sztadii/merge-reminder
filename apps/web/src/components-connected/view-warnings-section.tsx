import { Box, Card, CardBody, Skeleton } from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
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
              <Skeleton height={200}>Loading</Skeleton>
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

              {warnings.map(warning => {
                const details: DetailsGridProps['details'] = [
                  {
                    heading: 'Repo',
                    text: warning.repo
                  },
                  {
                    heading: 'Delay ( hours )',
                    text: warning.delayInHours
                  },
                  {
                    heading: 'Commits',
                    text: warning.commits.toString()
                  },
                  {
                    heading: 'Authors',
                    text: warning.authors.toString()
                  }
                ]

                return <DetailsGrid details={details} />
              })}
            </Text>
          )}
        </CardBody>
      </Card>
    </>
  )
}
