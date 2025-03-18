import { useParams } from 'wouter'
import { navigate as wouterNavigate } from 'wouter/use-browser-location'

export const routerPaths = {
  landing: createPathObject('/'),
  login: createPathObject('/login'),
  onboarding: createPathObject('/onboarding'),
  stopDeletion: createPathObject('/stop-deletion'),
  dashboard: createPathObject('/dashboard'),
  settings: createPathObject('/settings'),
  emailConfirmation: createPathObject<{ token: string }>(
    '/email-confirmation/:token'
  )
}

function createPathObject<T = undefined>(path: string) {
  return {
    path,
    navigate: () => wouterNavigate(path),
    isCurrentPage: () => window.location.pathname === path,
    useParams: () => useParams<T>()
  }
}
