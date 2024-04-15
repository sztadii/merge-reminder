import {
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
import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

export function ViewUserDetails() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()
  const { isOpen, onOpen, onClose } = useDisclosure()

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
