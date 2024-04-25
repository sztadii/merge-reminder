import { Button } from '@chakra-ui/react'
import { useEffect } from 'react'

import { Icon } from 'src/components/icon'
import { getSearchParams } from 'src/helpers'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function SubscribeButton() {
  const params = getSearchParams()
  const isSuccess = params.get('success')

  const { mutateAsync: createSubscribeUrl, isLoading } =
    trpc.payments.createSubscribeUrl.useMutation()

  useEffect(() => {
    if (!isSuccess) return

    showSuccessToast('Subscription confirmed')
  }, [isSuccess])

  async function redirectToCheckout() {
    try {
      const subscribeUrl = await createSubscribeUrl()
      window.location.assign(subscribeUrl)
    } catch {
      showErrorToast('Something went wrong')
    }
  }

  return (
    <Button
      isLoading={isLoading}
      onClick={redirectToCheckout}
      rightIcon={<Icon variant="chevronRight" />}
      width={{
        base: '100%',
        md: 'auto'
      }}
    >
      Subscribe
    </Button>
  )
}
