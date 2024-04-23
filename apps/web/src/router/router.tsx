import { Box } from '@chakra-ui/react'
import { ReactNode, useLayoutEffect } from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { Container } from 'src/components/container'
import { Navigation } from 'src/components/navigation'
import { Dashboard } from 'src/pages/dashboard'
import { Landing } from 'src/pages/landing'
import { Login } from 'src/pages/login'
import { Onboarding } from 'src/pages/onboarding'
import { Profile } from 'src/pages/profile'
import { Settings } from 'src/pages/settings'
import { storage } from 'src/storage'

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
            <PrivateLayout noLayout>
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
        path={routerPaths.profile.path}
        component={() => {
          return (
            <PrivateLayout>
              <Profile />
            </PrivateLayout>
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
  noLayout = false
}: {
  children: ReactNode
  noLayout?: boolean
}) {
  useLayoutEffect(() => {
    const token = storage.auth.getToken()

    if (!token) {
      routerPaths.login.navigate()
    }
  }, [])

  if (noLayout) return children

  return (
    <>
      <Navigation />

      <Box my={8}>
        <Container>{children}</Container>
      </Box>
    </>
  )
}
