import { Card, CardBody } from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { SubscribeButton } from 'src/features/buttons/subscribe-button'
import { UnsubscribeButton } from 'src/features/buttons/unsubscribe-button'
import { trpc } from 'src/trpc'

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
