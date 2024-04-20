import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  landing: createPage('/'),
  login: createPage('/login'),
  dashboard: createPage('/dashboard'),
  settings: createPage('/settings'),
  profile: createPage('/profile')
}

function createPage(path: string) {
  return {
    path,
    navigate() {
      wouterNavigate(this.path)
    },
    isCurrentPage() {
      return window.location.pathname === this.path
    }
  }
}
