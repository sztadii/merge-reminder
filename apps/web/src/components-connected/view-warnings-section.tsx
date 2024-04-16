import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Link,
  Skeleton,
  Spinner
} from '@chakra-ui/react'
import { useMemo } from 'react'

import { Icon } from 'src/components/icon'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

import { InstallReposButton } from './install-repos-button'
import { SendWarningsButton } from './send-warnings-button'

export function ViewWarningsSection() {
  const { data: user, isLoading: isLoadingForUser } =
    trpc.client.getCurrentUser.useQuery()

  const hasInstallationId = user?.hasInstallationId === true
  const hasNoInstallationId = user?.hasInstallationId === false

  const {
    data: warningsData,
    isFetching: isFetchingForWarnings,
    error: errorForWarnings
  } = trpc.client.getCurrentWarnings.useQuery(undefined, {
    enabled: hasInstallationId
  })

  const warnings = warningsData || []

  const tableColumns: TableProps<typeof warnings>['columns'] = useMemo(() => {
    return [
      {
        id: 'repo',
        width: {
          base: '150px',
          lg: 'auto'
        },
        headingCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: () => 'Repo'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: warning => warning.repo
        }
      },
      {
        id: 'delayInHours',
        width: {
          base: '100px',
          lg: 'auto'
        },
        headingCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: () => 'Delay'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: user => user.delay
        }
      },
      {
        id: 'commits',
        width: {
          base: '200px',
          lg: 'auto'
        },
        headingCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: () => 'Unmerged commits'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: warning => {
            return (
              <Flex gap={2} alignItems="center">
                <Link
                  href={warning.compareLink}
                  isExternal
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text noOfLines={1}>{warning.commits.join(', ')}</Text>

                  <Icon variant="externalLink" />
                </Link>
              </Flex>
            )
          }
        }
      },
      {
        id: 'authors',
        width: {
          base: '200px',
          lg: 'auto'
        },
        headingCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: () => 'Authors'
        },
        rowCell: {
          skeleton: () => <Skeleton>Loading</Skeleton>,
          content: warning => {
            return (
              <Text noOfLines={1} isTruncated>
                {warning.authors.join(', ')}
              </Text>
            )
          }
        }
      }
    ]
  }, [])

  if (isLoadingForUser) {
    return (
      <Card>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader position="relative">
          <Heading size="md">
            {isFetchingForWarnings ? (
              <Skeleton display="inline">Warnings</Skeleton>
            ) : (
              'Warnings'
            )}
          </Heading>

          {!!warnings.length && (
            <Box position="absolute" top={4} right={4}>
              <SendWarningsButton />
            </Box>
          )}
        </CardHeader>
        <CardBody>
          {hasNoInstallationId && <InstallReposButton />}

          {hasInstallationId && (
            <Table
              columns={tableColumns}
              rows={warnings}
              numberOfSkeletonRows={6}
              isLoading={isFetchingForWarnings}
              errorMessage={errorForWarnings?.message}
              noDataMessage="All your repos are looking well. Good job team!"
            />
          )}
        </CardBody>
      </Card>
    </>
  )
}
