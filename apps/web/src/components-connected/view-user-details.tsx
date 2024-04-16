import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { trpc } from 'src/trpc'

import { UpdateUserDrawer } from './update-user-drawer'

export function ViewUserDetails() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  const {
    isOpen: isOpenForUpdateDrawer,
    onOpen: onOpenForUpdateDrawer,
    onClose: onCloseForUpdateDrawer
  } = useDisclosure()

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Email',
      text: user?.email || (
        <Button
          variant="link"
          colorScheme="red"
          onClick={onOpenForUpdateDrawer}
        >
          Please provide the email
        </Button>
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
        <CardHeader position="relative">
          <Heading size="md">
            {isLoading ? (
              <Skeleton display="inline-block">Profile</Skeleton>
            ) : (
              'Profile'
            )}
          </Heading>

          <Box position="absolute" top={4} right={4}>
            {isLoading ? (
              <Skeleton>
                <IconButton aria-label="update profile" />
              </Skeleton>
            ) : (
              <IconButton
                aria-label="update profile"
                isDisabled={!user}
                onClick={onOpenForUpdateDrawer}
                icon={<Icon variant="edit" />}
              />
            )}
          </Box>
        </CardHeader>

        <CardBody>
          <DetailsGrid
            details={details}
            isLoading={isLoading}
            error={error?.message}
          />
        </CardBody>
      </Card>

      <UpdateUserDrawer
        user={user}
        isOpen={isOpenForUpdateDrawer}
        onClose={onCloseForUpdateDrawer}
      />
    </>
  )
}
