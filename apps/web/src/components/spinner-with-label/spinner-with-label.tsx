import { Flex, Spinner, SpinnerProps } from '@chakra-ui/react'

import { Text } from 'src/components/text'

type SpinnerWithLabelProps = {
  label: string
  color?: SpinnerProps['color']
  size?: SpinnerProps['size']
}

export function SpinnerWithLabel({
  label,
  color,
  size = 'xs'
}: SpinnerWithLabelProps) {
  return (
    <Flex gap={2} alignItems="center">
      <Text color={color} fontSize={size}>
        {label}
      </Text>
      <Spinner size={size} color={color} />
    </Flex>
  )
}
