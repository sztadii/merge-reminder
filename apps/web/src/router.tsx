import { Box } from '@chakra-ui/react'
import { Redirect, Route, Switch, useParams } from 'wouter'

import { Navigation } from 'src/components/navigation'
import { Project } from 'src/pages/project'
import { Projects } from 'src/pages/projects'
import { Users } from 'src/pages/users'

export function Router() {
  return (
    <>
      <Box>
        <Navigation />
      </Box>

      <Box p={4}>
        <Switch>
          <Route path={routerPaths.projects.path} component={Projects} />
          <Route path={routerPaths.project.path} component={Project} />
          <Route path={routerPaths.users.path} component={Users} />
          <Redirect to={routerPaths.projects.path} />
        </Switch>
      </Box>
    </>
  )
}

export const routerPaths = {
  projects: {
    path: '/projects'
  },
  project: {
    path: '/projects/:id',
    generateURL(id: string) {
      return replacePathWithParam(this.path, { id })
    },
    getParams() {
      return useParams<{ id: string }>()
    }
  },
  users: {
    path: '/users'
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
