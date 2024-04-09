import { Flex, Spinner, SpinnerProps } from '@chakra-ui/react'

import { Text } from 'src/components/text'

type SpinnerWithLabelProps = {
  label: string
  color?: SpinnerProps['color']
  size?: 'sm' | 'md' | 'lg'
}

const gaps = {
  sm: 3,
  md: 4,
  lg: 5
}

export function SpinnerWithLabel({
  label,
  color,
  size = 'sm'
}: SpinnerWithLabelProps) {
  return (
    <Flex gap={gaps[size]} alignItems="center">
      <Spinner size={size} color={color} />

      <Text color={color} fontSize={size}>
        {label}
      </Text>
    </Flex>
  )
}
