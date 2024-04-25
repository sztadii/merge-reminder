import { Card, CardBody } from '@chakra-ui/react'

import { DeleteUserButton } from 'src/components-connected/buttons/delete-user-button'
import { DisconnectReposButton } from 'src/components-connected/buttons/disconnect-repos-button'
import { ToggleThemeButton } from 'src/components-connected/buttons/toggle-theme-button'
import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { trpc } from 'src/trpc'

export function BasicSettingsSection() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Change theme',
      text: <ToggleThemeButton />
    },
    {
      heading: 'Disconnect repositories',
      text: <DisconnectReposButton user={user} />
    },
    {
      heading: 'Delete profile',
      text: <DeleteUserButton user={user} />
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
