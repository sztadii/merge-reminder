import { Box } from '@chakra-ui/react'

import { ConnectReposButton } from 'src/components-connected/buttons/connect-repos-button'
import { RepositoriesSection } from 'src/components-connected/sections/repositories-section'
import { ViewUserDetails } from 'src/components-connected/sections/view-user-details'
import { ViewWarningsSection } from 'src/components-connected/sections/view-warnings-section'
import { trpc } from 'src/trpc'

export function Dashboard() {
  const { data: user } = trpc.client.getCurrentUser.useQuery()

  function renderContent() {
    if (!user) return

    if (!user.hasInstallationId)
      return (
        <Box mt={4}>
          <ConnectReposButton />
        </Box>
      )

    return (
      <>
        <Box mt={4}>
          <ViewWarningsSection />
        </Box>
        <Box mt={4}>
          <RepositoriesSection />
        </Box>
      </>
    )
  }

  return (
    <>
      <ViewUserDetails />

      {renderContent()}
    </>
  )
}
