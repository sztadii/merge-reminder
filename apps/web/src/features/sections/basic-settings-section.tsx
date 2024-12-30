import { Card, CardBody } from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { DeleteUserButton } from 'src/features/buttons/delete-user-button'
import { DisconnectReposButton } from 'src/features/buttons/disconnect-repos-button'
import { trpc } from 'src/trpc'

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
