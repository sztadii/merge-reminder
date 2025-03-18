import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

import { Container } from '@apps/web/components/container'
import { Navigation } from '@apps/web/features/others/navigation'
import { trpc } from '@apps/web/libs/trpc'
import { routerPaths } from '@apps/web/router/router-paths'
import { storage } from '@apps/web/storage'

export function PublicLayout({ children }: { children: ReactNode }) {
  const isLoginPage = routerPaths.login.isCurrentPage()
  const token = storage.auth.getToken()

  if (isLoginPage && token) {
    routerPaths.dashboard.navigate()
    return
  }

  return children
}

export function PrivateLayout({
  children,
  hasCustomLayout = false
}: {
  children: ReactNode
  hasCustomLayout?: boolean
}) {
  const token = storage.auth.getToken()

  const { data: user } = trpc.client.getCurrentUser.useQuery(undefined, {
    enabled: !!token
  })

  if (!token) {
    routerPaths.login.navigate()
    return
  }

  if (user?.isDeleted) {
    routerPaths.stopDeletion.navigate()
    return
  }

  if (hasCustomLayout) return children

  return (
    <>
      <Navigation />

      <Box my={8}>
        <Container>{children}</Container>
      </Box>
    </>
  )
}
