import { Button, Skeleton, useDisclosure } from '@chakra-ui/react'

import { Confirmation } from 'src/components/confirmation'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function SendWarningsButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isFetching: isFetchingForWarnings, error: errorForWarnings } =
    trpc.clientRole.getCurrentWarnings.useQuery()

  const { mutateAsync: sendWarningsMutation, isLoading: isSendingWarnings } =
    trpc.clientRole.sendCurrentWarnings.useMutation()

  async function sendWarnings() {
    onClose()

    try {
      await sendWarningsMutation()
      showSuccessToast('Warnings has been send!')
    } catch {
      showErrorToast('Something went wrong when sending warnings!')
    }
  }

  if (errorForWarnings) return null

  return (
    <>
      {isFetchingForWarnings ? (
        <Skeleton display="inline-block">
          <Button size="xs">Send warnings</Button>
        </Skeleton>
      ) : (
        <Button
          size="xs"
          colorScheme="red"
          isLoading={isSendingWarnings}
          onClick={onOpen}
        >
          Send warnings
        </Button>
      )}

      <Confirmation
        isOpen={isOpen}
        onClose={onClose}
        title="Send warnings"
        description={
          <>
            You don't need to do this manually. <br />
            Every day, we will automatically send emails. <br />
            We've created it so you can test our app. <br />
            <br />
            Are you sure you want to send emails to all commit authors?
          </>
        }
        confirmButton={{
          name: 'Confirm',
          onClick: sendWarnings,
          colorScheme: 'red'
        }}
      />
    </>
  )
}