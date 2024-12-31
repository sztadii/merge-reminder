import { IconButton, useDisclosure } from '@chakra-ui/react'

import { Confirmation } from '@apps/web/components/confirmation'
import { Icon } from '@apps/web/components/icon'
import { showErrorToast, showSuccessToast } from '@apps/web/libs/toasts'
import { trpc } from '@apps/web/libs/trpc'

export function SendWarningsButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { mutateAsync: sendWarningsMutation, isLoading: isSendingWarnings } =
    trpc.client.sendCurrentWarnings.useMutation()

  async function sendWarnings() {
    onClose()

    try {
      await sendWarningsMutation()
      showSuccessToast('Warnings has been send.')
    } catch {
      showErrorToast('Something went wrong when sending warnings.')
    }
  }

  return (
    <>
      <IconButton
        aria-label="send warnings"
        icon={<Icon variant="bell" />}
        colorScheme="red"
        isLoading={isSendingWarnings}
        onClick={onOpen}
      />

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
          text: 'Confirm',
          onClick: sendWarnings
        }}
      />
    </>
  )
}
