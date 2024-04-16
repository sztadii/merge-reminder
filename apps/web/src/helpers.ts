import { routerPaths } from 'src/router'
import { storage } from 'src/storage'

export function logout(): void {
  storage.auth.removeToken()
  routerPaths.login.navigate()
}

export function removeSearchParamsFromURL(): void {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  url.search = ''
  window.history.replaceState({}, '', url.toString())
}
