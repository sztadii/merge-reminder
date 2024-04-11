import { routerPaths } from 'src/router'
import { storage } from 'src/storage'

export function logout() {
  storage.auth.removeToken()
  routerPaths.login.navigate()
}
