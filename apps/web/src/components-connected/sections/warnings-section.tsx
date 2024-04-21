import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton
} from '@chakra-ui/react'
import { useMemo } from 'react'

import { RefreshWarningsButton } from 'src/components-connected/buttons/refresh-warnings-button'
import { SendWarningsButton } from 'src/components-connected/buttons/send-warnings-button'
import { ExternalLink } from 'src/components/external-link'
import { SpinnerWithLabel } from 'src/components/spinner-with-label'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

export function WarningsSection() {
  const {
    data: warningsData,
    isLoading: isLoadingForWarnings,
    isFetching: isFetchingForWarnings,
    error: errorForWarnings
  } = trpc.client.getCurrentWarnings.useQuery()

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
          content: () => 'Repository'
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
              <ExternalLink
                to={warning.compareLink}
                text={warning.commits.join(', ')}
              />
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

  function renderContent() {
    return (
      <Table
        columns={tableColumns}
        rows={warnings}
        numberOfSkeletonRows={6}
        isLoading={isLoadingForWarnings}
        errorMessage={errorForWarnings?.message}
        noDataMessage="All your repos are looking well. Good job team."
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader position="relative">
          <Flex alignItems="center" gap={4}>
            <Heading size="md">
              {isLoadingForWarnings ? (
                <Skeleton display="inline">Warnings</Skeleton>
              ) : (
                'Warnings'
              )}
            </Heading>

            {warningsData && isFetchingForWarnings && (
              <SpinnerWithLabel
                size="sm"
                label="Fetching the latest warnings"
              />
            )}
          </Flex>

          {!!warnings.length && (
            <Flex
              position="absolute"
              top={4}
              right={4}
              gap={4}
              alignItems="center"
            >
              <SendWarningsButton />
              <RefreshWarningsButton />
            </Flex>
          )}
        </CardHeader>
        <CardBody>{renderContent()}</CardBody>
      </Card>
    </>
  )
}
