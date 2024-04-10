import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  UnorderedList,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { trpc } from 'src/trpc'

export function ViewUserDetails() {
  const { data: user, isLoading, error } = trpc.users.getCurrentUser.useQuery()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const colorForLink = useColorModeValue('yellow.600', 'yellow.400')

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Email',
      text: user?.email || (
        <Alert status="warning">
          <AlertIcon />
          Please provide the email
        </Alert>
      )
    },
    {
      heading: 'Github access token',
      text: user?.githubAccessToken || (
        <Alert status="warning">
          <AlertIcon />
          Create token
          <Button
            onClick={onOpen}
            color={colorForLink}
            variant="link"
            fontWeight={400}
          >
            here
          </Button>
        </Alert>
      )
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to create the GitHub access token?</ModalHeader>

          <ModalBody>
            <UnorderedList>
              <ListItem>
                Visit
                <Link
                  ml={1}
                  href="https://github.com/settings/tokens/new"
                  isExternal
                >
                  https://github.com/settings/tokens/new
                </Link>
              </ListItem>
              <ListItem>Provide a name for the token.</ListItem>
              <ListItem>Set an expiration date. We recommend 90 days.</ListItem>
              <ListItem>
                Select scopes. Only select the "repo" checkbox.
              </ListItem>
            </UnorderedList>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
