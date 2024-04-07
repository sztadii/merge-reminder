import { Box, Card, CardBody, SimpleGrid, Skeleton } from '@chakra-ui/react'

import { Text } from 'src/components/text'
import { useUserFromUrl } from 'src/hooks/use-user-from-url'

export function ViewUserSection() {
  const { data: user, isLoading: isLoadingUser } = useUserFromUrl()

  const details = [
    {
      heading: 'Role',
      text: user?.role
    },
    {
      heading: 'Email',
      text: user?.email
    },
    {
      heading: 'Github login',
      text: user?.githubLogin
    },
    {
      heading: 'Github organization',
      text: user?.githubOrganization
    },
    {
      heading: 'Head branch',
      text: user?.headBranch
    },
    {
      heading: 'Base branch',
      text: user?.baseBranch
    },
    {
      heading: 'Github access token',
      text: user?.githubAccessToken
    }
  ]

  return (
    <>
      <Card>
        <CardBody>
          {isLoadingUser && (
            <SimpleGrid columns={4} spacing={8}>
              {details.map(detail => {
                return (
                  <Box key={detail.heading}>
                    <Box mb={1}>
                      <Text fontSize="xs" color="gray.400">
                        <Skeleton display="inline-block" width={100}>
                          Loading
                        </Skeleton>
                      </Text>
                    </Box>

                    <Text>
                      <Skeleton display="inline-block" width={200}>
                        Loading
                      </Skeleton>
                    </Text>
                  </Box>
                )
              })}
            </SimpleGrid>
          )}

          {!isLoadingUser && !user && <Text>No user with the selected ID</Text>}

          {user && (
            <SimpleGrid columns={4} spacing={8}>
              {details.map(detail => {
                return (
                  <Box key={detail.heading}>
                    <Box mb={1}>
                      <Text fontSize="xs" color="gray.400">
                        {detail.heading}:
                      </Text>
                    </Box>

                    <Text>{detail.text}</Text>
                  </Box>
                )
              })}
            </SimpleGrid>
          )}
        </CardBody>
      </Card>
    </>
  )
}
