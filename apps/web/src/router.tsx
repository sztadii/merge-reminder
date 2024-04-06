import { Box } from '@chakra-ui/react'
import { Redirect, Route, Switch, useParams } from 'wouter'

import { Navigation } from 'src/components/navigation'
import { Users } from 'src/pages/users'

export function Router() {
  return (
    <>
      <Box>
        <Navigation />
      </Box>

      <Box p={4}>
        <Switch>
          <Route path={routerPaths.users.path} component={Users} />
          <Redirect to={routerPaths.users.path} />
        </Switch>
      </Box>
    </>
  )
}

export const routerPaths = {
  users: {
    path: '/users'
  },
  user: {
    path: '/users/:id',
    generateURL(id: string) {
      return replacePathWithParam(this.path, { id })
    },
    getParams() {
      return useParams<{ id: string }>()
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
