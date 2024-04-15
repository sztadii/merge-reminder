import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  landing: {
    path: '/',
    navigate() {
      wouterNavigate(this.path)
    }
  },
  login: {
    path: '/login',
    navigate() {
      wouterNavigate(this.path)
    }
  },
  profile: {
    path: '/profile',
    navigate() {
      wouterNavigate(this.path)
    }
  }
}
