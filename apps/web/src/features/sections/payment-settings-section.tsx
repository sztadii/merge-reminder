import { Card, CardBody } from '@chakra-ui/react'

import {
  DetailsGrid,
  DetailsGridProps
} from '@apps/web/components/details-grid'
import { SubscribeButton } from '@apps/web/features/buttons/subscribe-button'
import { UnsubscribeButton } from '@apps/web/features/buttons/unsubscribe-button'
import { trpc } from '@apps/web/libs/trpc'

export function PaymentSettingsSection() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Subscribe',
      content: <SubscribeButton />
    },
    {
      heading: 'Unsubscribe',
      content: <UnsubscribeButton />
    }
  ]

  return (
    <>
      <Card>
        <CardBody minHeight="200px">
          <DetailsGrid
            details={details}
            isLoading={isLoading}
            error={error?.message}
          />
        </CardBody>
      </Card>
    </>
  )
}
