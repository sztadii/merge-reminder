import { Card, CardBody } from '@chakra-ui/react'

import {
  DetailsGrid,
  DetailsGridProps
} from '@apps/web/components/details-grid'
import { DeleteUserButton } from '@apps/web/features/buttons/delete-user-button'
import { DisconnectReposButton } from '@apps/web/features/buttons/disconnect-repos-button'
import { trpc } from '@apps/web/trpc'

export function BasicSettingsSection() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Disconnect repositories',
      content: <DisconnectReposButton user={user} />
    },
    {
      heading: 'Delete profile',
      content: <DeleteUserButton user={user} />
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
