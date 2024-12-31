import { IconButton } from '@chakra-ui/react'

import { Icon } from '@apps/web/components/icon'
import { trpc } from '@apps/web/trpc'

export function RefreshWarningsButton() {
  const { isFetching, refetch } = trpc.client.getCurrentWarnings.useQuery(
    undefined,
    { enabled: false }
  )

  return (
    <IconButton
      colorScheme="teal"
      isDisabled={isFetching}
      aria-label="refresh warning"
      icon={<Icon variant="repeat" />}
      onClick={() => refetch()}
    />
  )
}
