import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton
} from '@chakra-ui/react'
import { useMemo } from 'react'

import { ExternalLink } from '@apps/web/components/external-link'
import { SpinnerWithLabel } from '@apps/web/components/spinner-with-label'
import { Table, TableProps } from '@apps/web/components/table'
import { Text } from '@apps/web/components/text'
import { RefreshWarningsButton } from '@apps/web/features/buttons/refresh-warnings-button'
import { SendWarningsButton } from '@apps/web/features/buttons/send-warnings-button'
import { trpc } from '@apps/web/libs/trpc'

export function WarningsSection() {
  const {
    data: warningsData,
    isLoading: isLoadingForWarnings,
    isFetching: isFetchingForWarnings,
    error: errorForWarnings
  } = trpc.client.getCurrentWarnings.useQuery()

  const warnings = useMemo(() => warningsData || [], [warningsData])

  const tableColumns: TableProps<typeof warnings>['columns'] = useMemo(() => {
    return [
      {
        id: 'repo',
        width: {
          base: '150px',
          lg: 'auto'
        },
        headingCell: {
          content: () => 'Repository'
        },
        rowCell: {
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
          content: () => 'Delay'
        },
        rowCell: {
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
          content: () => 'Unmerged commits'
        },
        rowCell: {
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
        numberOfVisibleRows={6}
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
              <Skeleton display="inline" isLoaded={!isLoadingForWarnings}>
                Warnings
              </Skeleton>
            </Heading>

            {warningsData && isFetchingForWarnings && (
              <SpinnerWithLabel
                size="sm"
                label="Fetching the latest warnings"
              />
            )}
          </Flex>

          <Flex
            position="absolute"
            top={4}
            right={4}
            gap={4}
            alignItems="center"
          >
            {!!warnings.length && <SendWarningsButton />}

            <Skeleton isLoaded={!isLoadingForWarnings}>
              <RefreshWarningsButton />
            </Skeleton>
          </Flex>
        </CardHeader>
        <CardBody minHeight="300px">{renderContent()}</CardBody>
      </Card>
    </>
  )
}
