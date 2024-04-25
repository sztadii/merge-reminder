import { useParams } from 'wouter'
import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  landing: createPage('/'),
  login: createPage('/login'),
  onboarding: createPage('/onboarding'),
  dashboard: createPage('/dashboard'),
  settings: createPage('/settings'),
  emailConfirmation: {
    path: '/email-confirmation/:token',
    useParams() {
      return useParams<{ token: string }>()
    }
  }
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
