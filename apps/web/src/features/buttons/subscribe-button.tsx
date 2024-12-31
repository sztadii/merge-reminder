import { Button, Tooltip } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect } from 'react'

import { Icon } from '@apps/web/components/icon'
import { getSearchParams, removeSearchParamsFromURL } from '@apps/web/helpers'
import { showErrorToast, showSuccessToast } from '@apps/web/toasts'
import { trpc } from '@apps/web/trpc'

export function SubscribeButton() {
  const params = getSearchParams()
  const sessionId = params.get('session_id')

  const queryClient = useQueryClient()

  const { data: user, isLoading: isLoadingForUser } =
    trpc.client.getCurrentUser.useQuery()

  const {
    mutateAsync: createSubscribeUrl,
    isLoading: isLoadingForSubscribeUrl
  } = trpc.payments.createSubscribeUrl.useMutation()

  const {
    mutateAsync: updateCurrentCheckoutSessionId,
    isLoading: isLoadingForUpdatingSession
  } = trpc.payments.updateCurrentCheckoutSessionId.useMutation()

  useEffect(() => {
    async function updateSession() {
      if (!sessionId) return

      try {
        await updateCurrentCheckoutSessionId({ sessionId })

        queryClient
          .invalidateQueries(getQueryKey(trpc.client.getCurrentUser))
          .then()

        showSuccessToast('Subscription confirmed.')
      } catch {
        showErrorToast('Something went wrong.')
      } finally {
        removeSearchParamsFromURL()
      }
    }

    updateSession()
  }, [])

  async function redirectToCheckout() {
    try {
      const url = await createSubscribeUrl()
      window.location.assign(url)
    } catch {
      showErrorToast('Something went wrong.')
    }
  }

  function getDisabledMessage() {
    const hasProvidedEmail = user?.email
    if (!hasProvidedEmail) return 'You did not provide any email yet.'

    const isEmailConfirmed = user?.isEmailConfirmed === true
    if (!isEmailConfirmed) return 'Your email is not confirmed yet.'

    const hasCheckoutSessionId = user?.stripeCheckoutSessionId
    if (hasCheckoutSessionId) return 'You are already subscribing.'

    return undefined
  }

  const isLoading =
    isLoadingForUser || isLoadingForSubscribeUrl || isLoadingForUpdatingSession
  const disabledMessage = getDisabledMessage()

  return (
    <Tooltip label={disabledMessage} placement="top">
      <Button
        isLoading={isLoading}
        isDisabled={!!disabledMessage}
        onClick={redirectToCheckout}
        rightIcon={<Icon variant="chevronRight" />}
        width={{
          base: '100%',
          md: 'auto'
        }}
      >
        Subscribe
      </Button>
    </Tooltip>
  )
}
