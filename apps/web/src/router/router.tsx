import { Redirect, Route, Switch } from 'wouter'

import { Dashboard } from '@apps/web/pages/dashboard'
import { EmailConfirmation } from '@apps/web/pages/email-confirmation'
import { Landing } from '@apps/web/pages/landing'
import { Login } from '@apps/web/pages/login'
import { Onboarding } from '@apps/web/pages/onboarding'
import { Settings } from '@apps/web/pages/settings'
import { StopDeletion } from '@apps/web/pages/stop-deletion'

import { PrivateLayout, PublicLayout } from './layouts'
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
