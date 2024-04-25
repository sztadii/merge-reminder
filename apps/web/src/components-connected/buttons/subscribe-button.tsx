import { Button } from '@chakra-ui/react'

import { Icon } from 'src/components/icon'
import { trpc } from 'src/trpc'

export function SubscribeButton() {
  const { data: subscribeUrl, isLoading } =
    trpc.payments.createSubscribeUrl.useQuery()

  function redirectToCheckout() {
    if (!subscribeUrl) return

    window.location.assign(subscribeUrl)
  }

  return (
    <Button
      isLoading={isLoading}
      onClick={redirectToCheckout}
      rightIcon={<Icon variant="chevronRight" />}
    >
      Subscribe
    </Button>
  )
}
