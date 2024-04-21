import {
  Box,
  Button,
  Card,
  CardBody,
  IconButton,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react'

import { UpdateUserDrawer } from 'src/components-connected/drawers/update-user-drawer'
import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { trpc } from 'src/trpc'

export function ProfileSection() {
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
    }
  ]

  return (
    <>
      <Card position="relative">
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

        <CardBody minHeight="300px">
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
