import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  login: {
    path: '/',
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
