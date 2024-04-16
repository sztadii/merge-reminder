import { Flex, Spinner, SpinnerProps } from '@chakra-ui/react'

import { Text } from 'src/components/text'

type SpinnerWithLabelProps = {
  label: string
  color?: SpinnerProps['color']
  size?: 'sm' | 'md' | 'lg'
}

const gaps = {
  sm: 2,
  md: 3,
  lg: 4
}

export function SpinnerWithLabel({
  label,
  color,
  size = 'sm'
}: SpinnerWithLabelProps) {
  return (
    <Flex gap={gaps[size]} alignItems="center">
      <Spinner size={size} color={color} />

      <Text hideBelow="md" color={color} fontSize={size}>
        {label}
      </Text>
    </Flex>
  )
}
