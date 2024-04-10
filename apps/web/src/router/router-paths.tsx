import { useParams } from 'wouter'
import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  login: {
    path: '/',
    navigate() {
      wouterNavigate(this.path)
    }
  },
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
