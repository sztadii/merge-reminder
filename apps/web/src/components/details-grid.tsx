import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react'
import { ReactNode } from 'react'

import { Text } from 'src/components/text'

export type DetailsGridProps = {
  details: Array<{
    heading: string
    text?: ReactNode
  }>
  isLoading?: boolean
  error?: string
}

export function DetailsGrid({ details, isLoading, error }: DetailsGridProps) {
  if (error) {
    return <Text>{error}</Text>
  }

  return (
    <SimpleGrid columns={{ sm: 1, lg: 2, xl: 4 }} spacing={4}>
      {details.map(detail => {
        return (
          <Box key={detail.heading}>
            <Box mb={1}>
              <Text fontWeight="bold" fontSize="xs" color="gray.400">
                {isLoading ? (
                  <Skeleton display="inline-block" width={100}>
                    Loading
                  </Skeleton>
                ) : (
                  detail.heading
                )}
              </Text>
            </Box>

            <Text>
              {isLoading ? (
                <Skeleton display="inline-block" width={200}>
                  Loading
                </Skeleton>
              ) : (
                detail.text
              )}
            </Text>
          </Box>
        )
      })}
    </SimpleGrid>
  )
}
