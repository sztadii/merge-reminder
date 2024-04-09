import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Link,
  Skeleton
} from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
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

  const detailsForLoading = new Array(4).fill(null).map(() => {
    return {
      heading: '',
      text: ''
    }
  })

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="sm">
            {isLoadingWarnings ? (
              <Skeleton display="inline-block">Warnings</Skeleton>
            ) : (
              'Warnings'
            )}
          </Heading>
        </CardHeader>
        <CardBody>
          {isLoadingWarnings && <Skeleton height={100} />}

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
                    text: (
                      <Flex gap={2} alignItems="center">
                        <Link
                          href={warning.compareLink}
                          isExternal
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Text noOfLines={1}>
                            {warning.commits.join(', ')}
                          </Text>

                          <Icon variant="externalLink" />
                        </Link>
                      </Flex>
                    )
                  },
                  {
                    heading: 'Authors',
                    text: (
                      <Text noOfLines={1} isTruncated>
                        {warning.authors.join(', ')}
                      </Text>
                    )
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
