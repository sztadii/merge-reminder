import { notifyManager, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function usePendingMutationVariables() {
  const queryClient = useQueryClient()
  const [pendingMutationVariables, setPendingMutationVariables] = useState<
    unknown[]
  >([])

  useEffect(() => {
    const checkPendingMutations = () => {
      const mutations = queryClient.getMutationCache().getAll()
      if (!mutations.length) return

      const variables = mutations.map(mutation => mutation.state.variables)

      setPendingMutationVariables(variables)
    }

    checkPendingMutations()

    const unsubscribe = queryClient
      .getMutationCache()
      .subscribe(notifyManager.batchCalls(checkPendingMutations))

    return () => {
      unsubscribe()
    }
  }, [queryClient])

  return pendingMutationVariables
}
