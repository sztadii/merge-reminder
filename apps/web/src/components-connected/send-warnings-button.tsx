import { Button, Skeleton, Tooltip } from '@chakra-ui/react'

import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function SendWarningsButton() {
  const { isFetching: isFetchingForWarnings, error: errorForWarnings } =
    trpc.clientRole.getCurrentWarnings.useQuery()

  const { mutateAsync: sendWarningsMutation, isLoading: isSendingWarnings } =
    trpc.clientRole.sendCurrentWarnings.useMutation()

  async function sendWarnings() {
    try {
      await sendWarningsMutation()
      showSuccessToast('Warnings has been send!')
    } catch {
      showErrorToast('Something went wrong when sending warnings!')
    }
  }

  if (errorForWarnings) return null

  const triggerMessage =
    "You don't need to do this manually. Every day, we will automatically send emails. We've created it so you can test our app"

  return (
    <>
      {isFetchingForWarnings ? (
        <Skeleton display="inline-block">
          <Button size="xs">Send warnings</Button>
        </Skeleton>
      ) : (
        <Tooltip placement="left" hasArrow label={triggerMessage}>
          <Button
            size="xs"
            colorScheme="red"
            isLoading={isSendingWarnings}
            onClick={sendWarnings}
          >
            Send warnings
          </Button>
        </Tooltip>
      )}
    </>
  )
}
