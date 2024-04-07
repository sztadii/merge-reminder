import { Card, CardBody, Skeleton } from '@chakra-ui/react'

import { SpinnerWithLabel } from 'src/components/spinner-with-label'
import { Text } from 'src/components/text'
import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function ViewReminderSection() {
  const params = routerPaths.user.getParams()

  const {
    data: reminder,
    isLoading: isLoadingReminder,
    isFetching: isFetchingReminder
  } = trpc.reminders.getReminder.useQuery(params.id)

  return (
    <>
      <Card>
        <CardBody>
          {isLoadingReminder && (
            <Text>
              <Skeleton display="inline">Loading</Skeleton>
            </Text>
          )}

          {!isLoadingReminder && !reminder && (
            <Text>No reminder with the {params.id} ID</Text>
          )}

          {reminder && (
            <Text>
              {isFetchingReminder && (
                <SpinnerWithLabel label="Fetching the latest reminder" />
              )}
              {reminder}
            </Text>
          )}
        </CardBody>
      </Card>
    </>
  )
}
