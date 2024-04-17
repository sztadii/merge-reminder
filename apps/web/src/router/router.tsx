import { Box } from '@chakra-ui/react'
import { ReactNode, useLayoutEffect } from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { Navigation } from 'src/components/navigation'
import { Landing } from 'src/pages/landing'
import { Login } from 'src/pages/login'
import { Settings } from 'src/pages/settings'
import { User } from 'src/pages/user'
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
        path={routerPaths.profile.path}
        component={() => {
          return (
            <PrivateLayout>
              <User />
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

      <Redirect to={routerPaths.landing.path} />
    </Switch>
  )
}

function PublicLayout({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const isLoginPage = routerPaths.login.isCurrentPage()
    const token = storage.auth.getToken()

    if (isLoginPage && token) {
      routerPaths.profile.navigate()
    }
  }, [])

  return <>{children}</>
}

function PrivateLayout({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const token = storage.auth.getToken()

    if (!token) {
      routerPaths.login.navigate()
    }
  }, [])

  return (
    <>
      <Box>
        <Navigation />
      </Box>

      <Box p={4}>{children}</Box>
    </>
  )
}
