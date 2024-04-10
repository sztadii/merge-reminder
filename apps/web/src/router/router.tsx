import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { Navigation } from 'src/components/navigation'
import { Login } from 'src/pages/login'
import { User } from 'src/pages/user'
import { Users } from 'src/pages/users'

import { routerPaths } from './router-paths'

export function Router() {
  return (
    <Switch>
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
        path={routerPaths.user.path}
        component={() => {
          return (
            <PrivateLayout>
              <User />
            </PrivateLayout>
          )
        }}
      />

      <Route
        path={routerPaths.users.path}
        component={() => {
          return (
            <PrivateLayout>
              <Users />
            </PrivateLayout>
          )
        }}
      />

      <Redirect to={routerPaths.login.path} />
    </Switch>
  )
}

function PublicLayout({ children }: { children: ReactNode }) {
  return children
}

function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box>
        <Navigation />
      </Box>

      <Box p={4}>{children}</Box>
    </>
  )
}
