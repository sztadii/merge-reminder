import { Box } from '@chakra-ui/react'
import { ReactNode, useEffect, useLayoutEffect } from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { Container } from 'src/components/container'
import { Navigation } from 'src/features/others/navigation'
import { Dashboard } from 'src/pages/dashboard'
import { EmailConfirmation } from 'src/pages/email-confirmation'
import { Landing } from 'src/pages/landing'
import { Login } from 'src/pages/login'
import { Onboarding } from 'src/pages/onboarding'
import { Settings } from 'src/pages/settings'
import { StopDeletion } from 'src/pages/stop-deletion'
import { storage } from 'src/storage'
import { trpc } from 'src/trpc'

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
  useLayoutEffect(() => {
    const isLoginPage = routerPaths.login.isCurrentPage()
    const token = storage.auth.getToken()

    if (isLoginPage && token) {
      routerPaths.dashboard.navigate()
    }
  }, [])

  return <>{children}</>
}

function PrivateLayout({
  children,
  hasCustomLayout = false
}: {
  children: ReactNode
  hasCustomLayout?: boolean
}) {
  const { data: user } = trpc.client.getCurrentUser.useQuery()

  useLayoutEffect(() => {
    const token = storage.auth.getToken()

    if (!token) {
      routerPaths.login.navigate()
    }
  }, [])

  useEffect(() => {
    if (user?.isDeleted) {
      routerPaths.stopDeletion.navigate()
    }
  }, [user])

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
