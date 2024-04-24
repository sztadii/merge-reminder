import {
  Box,
  Button,
  Card,
  CardBody,
  IconButton,
  Skeleton,
  Tag,
  useDisclosure
} from '@chakra-ui/react'

import { UpdateEmailDrawer } from 'src/components-connected/drawers/update-email-drawer'
import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { trpc } from 'src/trpc'

export function EmailSection() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()

  const {
    isOpen: isOpenForUpdateDrawer,
    onOpen: onOpenForUpdateDrawer,
    onClose: onCloseForUpdateDrawer
  } = useDisclosure()

  function renderEmailContent() {
    if (!user) return

    if (!user.email)
      return (
        <Button
          variant="link"
          colorScheme="red"
          onClick={onOpenForUpdateDrawer}
        >
          Please provide the email
        </Button>
      )

    const { isEmailConfirmed } = user

    return (
      <>
        {user.email}{' '}
        {!isEmailConfirmed && <Tag colorScheme="red">Not confirmed</Tag>}
      </>
    )
  }

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Email',
      text: renderEmailContent()
    }
  ]

  return (
    <>
      <Card position="relative">
        <Box position="absolute" top={4} right={4}>
          <Skeleton isLoaded={!isLoading}>
            {!!user && (
              <IconButton
                aria-label="update profile"
                onClick={onOpenForUpdateDrawer}
                icon={<Icon variant="edit" />}
              />
            )}
          </Skeleton>
        </Box>

        <CardBody minHeight="300px">
          <DetailsGrid
            details={details}
            isLoading={isLoading}
            error={error?.message}
          />
        </CardBody>
      </Card>

      <UpdateEmailDrawer
        user={user}
        isOpen={isOpenForUpdateDrawer}
        onClose={onCloseForUpdateDrawer}
      />
    </>
  )
}
