import { routerPaths } from 'src/router'
import { storage } from 'src/storage'

export function logout(): void {
  storage.auth.removeToken()
  routerPaths.login.navigate()
}
