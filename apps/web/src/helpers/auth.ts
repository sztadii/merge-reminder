import { routerPaths } from '@apps/web/router'
import { storage } from '@apps/web/storage'

export function logout(): void {
  storage.auth.removeToken()
  routerPaths.login.navigate()
}
