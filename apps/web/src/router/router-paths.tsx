import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  landing: createPage('/'),
  login: createPage('/login'),
  profile: createPage('/profile'),
  settings: createPage('/settings')
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
