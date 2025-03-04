import { Box } from '@chakra-ui/react'
import { ReactNode, useEffect, useLayoutEffect } from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { Container } from '@apps/web/components/container'
import { Navigation } from '@apps/web/features/others/navigation'
import { trpc } from '@apps/web/libs/trpc'
import { Dashboard } from '@apps/web/pages/dashboard'
import { EmailConfirmation } from '@apps/web/pages/email-confirmation'
import { Landing } from '@apps/web/pages/landing'
import { Login } from '@apps/web/pages/login'
import { Onboarding } from '@apps/web/pages/onboarding'
import { Settings } from '@apps/web/pages/settings'
import { StopDeletion } from '@apps/web/pages/stop-deletion'
import { storage } from '@apps/web/storage'

import { routerPaths } from './router-paths'

export function Router() {
  return (
    <Switch>
      <Route
        path={routerPaths.landing.path}
        component={() => {
          return (
            <PublicLayout>
              <Landing />
            </PublicLayout>
          )
        }}
      />

      <Route
        path={routerPaths.login.path}
        component={() => {
          return (
            <PublicLayout>
              <Login />
            </PublicLayout>
          )
        }}
      />

      <Route
        path={routerPaths.onboarding.path}
        component={() => {
          return (
            <PrivateLayout hasCustomLayout>
              <Onboarding />
            </PrivateLayout>
          )
        }}
      />

      <Route
        path={routerPaths.dashboard.path}
        component={() => {
          return (
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          )
        }}
      />

      <Route
        path={routerPaths.settings.path}
        component={() => {
          return (
            <PrivateLayout>
              <Settings />
            </PrivateLayout>
          )
        }}
      />

      <Route
        path={routerPaths.emailConfirmation.path}
        component={() => {
          return (
            <PublicLayout>
              <EmailConfirmation />
            </PublicLayout>
          )
        }}
      />

      <Route
        path={routerPaths.stopDeletion.path}
        component={() => {
          return (
            <PublicLayout>
              <StopDeletion />
            </PublicLayout>
          )
        }}
      />

      <Redirect to={routerPaths.landing.path} />
    </Switch>
  )
}

function PublicLayout({ children }: { children: ReactNode }) {
  const isLoginPage = routerPaths.login.isCurrentPage()
  const token = storage.auth.getToken()

  if (isLoginPage && token) {
    routerPaths.dashboard.navigate()
    return
  }

  return <>{children}</>
}

function PrivateLayout({
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
