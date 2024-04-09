import {
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
import { SpinnerWithLabel } from 'src/components/spinner-with-label'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function ViewWarningsSection() {
  const params = routerPaths.user.getParams()

  const {
    data: warningsData,
    isLoading: isLoadingWarnings,
    error: errorForWarnings,
    isFetching: isFetchingWarnings
  } = trpc.warnings.getWarnings.useQuery(params.id)

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

  return (
    <>
      <Card>
        <CardHeader>
          <Flex alignItems="center" gap={4}>
            <Heading size="md">
              {isLoadingWarnings ? (
                <Skeleton display="inline-block">Warnings</Skeleton>
              ) : (
                'Warnings'
              )}
            </Heading>

            {warningsData && isFetchingWarnings && (
              <SpinnerWithLabel label="Fetching the latest warnings" />
            )}
          </Flex>
        </CardHeader>
        <CardBody>
          <Table
            columns={tableColumns}
            rows={warnings}
            skeletonRows={4}
            isLoading={isLoadingWarnings}
            errorMessage={errorForWarnings?.message}
            noDataMessage="All your repos are looking well. Good job team!"
          />
        </CardBody>
      </Card>
    </>
  )
}
