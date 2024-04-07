import { routerPaths } from 'src/router'
import { trpc } from 'src/trpc'

export function useUserFromUrl() {
  const params = routerPaths.user.getParams()
  return trpc.users.getById.useQuery(params.id)
}
