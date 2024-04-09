import {
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Link,
  useColorModeValue
} from '@chakra-ui/react'

import { DetailsGrid } from 'src/components/details-grid'
import { useUserFromUrl } from 'src/hooks/use-user-from-url'

export function ViewUserSection() {
  const { data: user, isLoading, error } = useUserFromUrl()

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
          <div>
            For {usersLink}, we can only fetch public repositories. However, we
            can retrieve all repositories from all repositories from
            {organizationsLink}.
          </div>
        </Alert>
      )}

      <Card>
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
