import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

export function ViewUserDetails() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  const colorForWarning = useColorModeValue('yellow.600', 'yellow.400')

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Email',
      text: user?.email || (
        <Text color={colorForWarning}>Please provide the email</Text>
      )
    },
    {
      heading: 'Head branch',
      text: user?.headBranch
    },
    {
      heading: 'Base branch',
      text: user?.baseBranch
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">
            {isLoading ? (
              <Skeleton display="inline-block">Basic information</Skeleton>
            ) : (
              'Basic information'
            )}
          </Heading>
        </CardHeader>

        <CardBody>
          <DetailsGrid
            details={details}
            isLoading={isLoading}
            error={error?.message}
          />
        </CardBody>
      </Card>
    </>
  )
}
