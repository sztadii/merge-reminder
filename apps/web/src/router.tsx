import { Box } from '@chakra-ui/react'
import { Redirect, Route, Switch, useParams } from 'wouter'
import { navigate as wouterNavigate } from 'wouter/use-browser-location'

import { Navigation } from 'src/components/navigation'
import { User } from 'src/pages/user'
import { Users } from 'src/pages/users'

export function Router() {
  return (
    <>
      <Box>
        <Navigation />
      </Box>

      <Box p={4}>
        <Switch>
          <Route path={routerPaths.user.path} component={User} />
          <Route path={routerPaths.users.path} component={Users} />
          <Redirect to={routerPaths.users.path} />
        </Switch>
      </Box>
    </>
  )
}

export const routerPaths = {
  users: {
    path: '/users',
    navigate() {
      wouterNavigate(this.path)
    }
  },
  user: {
    path: '/users/:id',
    generateURL(id: string) {
      return replacePathWithParam(this.path, { id })
    },
    getParams() {
      return useParams<{ id: string }>()
    },
    navigate() {
      wouterNavigate(this.path)
    }
  }
}

function replacePathWithParam(path: string, params: Record<string, string>) {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      path = path.replace(`:${key}`, params[key])
    }
  }
  return path
}
