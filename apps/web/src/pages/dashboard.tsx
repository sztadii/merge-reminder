import { Alert, AlertIcon, Box, Flex } from '@chakra-ui/react'

import { SpinnerWithLabel } from '@apps/web/components/spinner-with-label'
import { ConnectReposButton } from '@apps/web/features/buttons/connect-repos-button'
import { RepositoriesSection } from '@apps/web/features/sections/repositories-section'
import { WarningsSection } from '@apps/web/features/sections/warnings-section'
import { trpc } from '@apps/web/trpc'

export function Dashboard() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  if (isLoading)
    return (
      <Flex justifyContent="center">
        <SpinnerWithLabel label="Loading" />
      </Flex>
    )

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />

        {error.message}
      </Alert>
    )

  if (user?.hasInstallationId === false) return <ConnectReposButton />

  return (
    <>
      <Box>
        <WarningsSection />
      </Box>
      <Box mt={8}>
        <RepositoriesSection />
      </Box>
    </>
  )
}
