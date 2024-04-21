import { Flex, Link } from '@chakra-ui/react'

import { Icon } from './icon'
import { Text } from './text'

type ExternalLinkProps = {
  to: string
  text: string
}

export function ExternalLink({ to, text }: ExternalLinkProps) {
  return (
    <Flex gap={2} alignItems="center">
      <Link href={to} isExternal display="flex" alignItems="center" gap={2}>
        <Text noOfLines={1}>{text}</Text>
        <Icon variant="externalLink" />
      </Link>
    </Flex>
  )
}
