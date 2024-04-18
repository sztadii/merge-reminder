import { Card, CardBody, CardHeader, Heading, Skeleton } from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { trpc } from 'src/trpc'

import { DeleteUserButton } from './delete-user-button'
import { DisconnectReposButton } from './disconnect-repos-button'
import { ToggleThemeButton } from './toggle-theme-button'

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
        <CardHeader position="relative">
          <Heading size="md">
            {isLoading ? (
              <Skeleton display="inline-block">Settings</Skeleton>
            ) : (
              'Settings'
            )}
          </Heading>
        </CardHeader>

        <CardBody>
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
