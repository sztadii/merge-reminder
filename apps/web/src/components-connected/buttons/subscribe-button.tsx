import { Button, Tooltip } from '@chakra-ui/react'
import { useEffect } from 'react'

import { Icon } from 'src/components/icon'
import { getSearchParams, removeSearchParamsFromURL } from 'src/helpers'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function SubscribeButton() {
  const params = getSearchParams()
  const sessionId = params.get('session_id')

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
        showSuccessToast('Subscription confirmed.')
      } catch {
        showErrorToast('Something went wrong.')
      } finally {
        removeSearchParamsFromURL()
      }
    }

    updateSession()
  }, [sessionId])

  async function redirectToCheckout() {
    try {
      const subscribeUrl = await createSubscribeUrl()
      window.location.assign(subscribeUrl)
    } catch {
      showErrorToast('Something went wrong.')
    }
  }

  function getDisabledMessage() {
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
