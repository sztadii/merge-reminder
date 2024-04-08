import {
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  Link,
  SimpleGrid,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react'

import { Text } from 'src/components/text'
import { useUserFromUrl } from 'src/hooks/use-user-from-url'

export function ViewUserSection() {
  const { data: user, isLoading } = useUserFromUrl()

  const colorForLink = useColorModeValue('yellow.600', 'yellow.400')

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
      heading: 'User / organization name',
      text: user?.userOrOrganizationName
    },
    {
      heading: 'Is organization',
      text: user?.isOrganization ? 'Yes' : 'No'
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

  const usersLink = (
    <Link
      color={colorForLink}
      href="https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user"
      isExternal
      ml={1}
    >
      normal users
    </Link>
  )

  const organizationsLink = (
    <Link
      color={colorForLink}
      href="https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories"
      isExternal
      ml={1}
    >
      organizations
    </Link>
  )

  return (
    <>
      {user?.isOrganization === false && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          For {usersLink}, we can only fetch public repositories. However, we
          can retrieve all repositories from all repositories from
          {organizationsLink}.
        </Alert>
      )}

      <Card>
        <CardBody>
          {isLoading && (
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

          {!isLoading && !user && <Text>No user with the selected ID</Text>}

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
