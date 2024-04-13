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
import { useMemo } from 'react'

import { Icon } from 'src/components/icon'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

import { InstallReposButton } from './install-repos-button'
import { SendWarningsButton } from './send-warnings-button'

export function ViewWarningsSection() {
  const {
    data: warningsData,
    isFetching: isFetchingForWarnings,
    error: errorForWarnings
  } = trpc.client.getCurrentWarnings.useQuery()

  const { data: user, isLoading: isLoadingForUser } =
    trpc.client.getCurrentUser.useQuery()

  const warnings = warningsData || []

  const tableColumns: TableProps<typeof warnings>['columns'] = useMemo(() => {
    return [
      {
        id: 'repo',
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

  function renderContent() {
    if (isLoadingForUser) {
      return <Skeleton height={264} />
    }

    if (user?.hasInstallationId === false) {
      return <InstallReposButton />
    }

    return (
      <Table
        columns={tableColumns}
        rows={warnings}
        numberOfSkeletonRows={6}
        isLoading={isFetchingForWarnings}
        errorMessage={errorForWarnings?.message}
        noDataMessage="All your repos are looking well. Good job team!"
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading size="md">
              {isFetchingForWarnings ? (
                <Skeleton display="inline-block">Warnings</Skeleton>
              ) : (
                'Warnings'
              )}
            </Heading>

            <SendWarningsButton />
          </Flex>
        </CardHeader>
        <CardBody>{renderContent()}</CardBody>
      </Card>
    </>
  )
}
