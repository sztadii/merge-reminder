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
import { useEffect, useState } from 'react'

import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { UpdateEmailDrawer } from 'src/features/drawers/update-email-drawer'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function EmailSection() {
  const [isResendVisible, setIsResendVisible] = useState(false)

  const {
    data: user,
    isLoading: isLoadingForUser,
    error
  } = trpc.client.getCurrentUser.useQuery()

  const {
    mutateAsync: sendEmailConfirmationMutation,
    isLoading: isLoadingForEmailConfirmation
  } = trpc.client.sendEmailConfirmation.useMutation()

  const {
    isOpen: isOpenForUpdateDrawer,
    onOpen: onOpenForUpdateDrawer,
    onClose: onCloseForUpdateDrawer
  } = useDisclosure()

  useEffect(() => {
    if (!user || !user.email || user.isEmailConfirmed) return

    setTimeout(() => {
      setIsResendVisible(true)
    }, 5_000)
  }, [user])

  async function resendConfirmation() {
    const userEmail = user?.email
    if (!userEmail) return

    try {
      await sendEmailConfirmationMutation({
        email: userEmail
      })
      setIsResendVisible(false)
      showSuccessToast('Confirmation send.')
    } catch {
      showErrorToast('Could not resend the email.')
    }
  }

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
        <Box>{user.email}</Box>

        {!isEmailConfirmed && (
          <>
            <Box mt={2}>
              <Tag colorScheme="red">Not confirmed</Tag>
            </Box>

            {isResendVisible && (
              <Box mt={2}>
                <Button
                  isLoading={isLoadingForEmailConfirmation}
                  onClick={resendConfirmation}
                  size="xs"
                  rightIcon={<Icon variant="repeat" />}
                >
                  Resend confirmation
                </Button>
              </Box>
            )}
          </>
        )}
      </>
    )
  }

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Email',
      content: renderEmailContent()
    }
  ]

  return (
    <>
      <Card position="relative">
        <Box position="absolute" top={4} right={4}>
          <Skeleton isLoaded={!isLoadingForUser}>
            {!!user && (
              <IconButton
                colorScheme="teal"
                aria-label="update profile"
                onClick={onOpenForUpdateDrawer}
                icon={<Icon variant="edit" />}
              />
            )}
          </Skeleton>
        </Box>

        <CardBody minHeight="200px">
          <DetailsGrid
            details={details}
            isLoading={isLoadingForUser}
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
