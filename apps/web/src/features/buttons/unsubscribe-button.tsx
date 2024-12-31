import { Button, Tooltip } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { Icon } from '@apps/web/components/icon'
import { showErrorToast, showSuccessToast } from '@apps/web/toasts'
import { trpc } from '@apps/web/trpc'

export function UnsubscribeButton() {
  const queryClient = useQueryClient()

  const { data: user, isLoading: isLoadingForUser } =
    trpc.client.getCurrentUser.useQuery()

  const {
    mutateAsync: unsubscribeMutation,
    isLoading: isLoadingForUnsubscribe
  } = trpc.payments.unsubscribe.useMutation()

  async function unsubscribe() {
    try {
      await unsubscribeMutation()

      queryClient
        .invalidateQueries(getQueryKey(trpc.client.getCurrentUser))
        .then()

      showSuccessToast('Subscription cancelled.')
    } catch {
      showErrorToast('Something went wrong.')
    }
  }

  function getDisabledMessage() {
    const hasCheckoutSessionId = user?.stripeCheckoutSessionId
    if (!hasCheckoutSessionId) return 'You are not subscribing yet.'

    return undefined
  }

  const isLoading = isLoadingForUser || isLoadingForUnsubscribe
  const disabledMessage = getDisabledMessage()

  return (
    <Tooltip label={disabledMessage} placement="top">
      <Button
        isLoading={isLoading}
        isDisabled={!!disabledMessage}
        onClick={unsubscribe}
        rightIcon={<Icon variant="chevronRight" />}
        width={{
          base: '100%',
          md: 'auto'
        }}
      >
        Unsubscribe
      </Button>
    </Tooltip>
  )
}
