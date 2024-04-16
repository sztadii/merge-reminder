import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Skeleton,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'

import { DeleteUserConfirmation } from 'src/components-connected/delete-user-confirmation'
import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { logout } from 'src/helpers'
import { showErrorToast, showSuccessToast } from 'src/toasts'
import { trpc } from 'src/trpc'

export function BasicSettingsSection() {
  const { data: user, isLoading, error } = trpc.client.getCurrentUser.useQuery()
  const {
    mutateAsync: disconnectRepositoriesMutation,
    isLoading: isLoadingForDisconnecting
  } = trpc.client.disconnectRepositories.useMutation()

  const queryClient = useQueryClient()

  const {
    isOpen: isOpenForDeleteModal,
    onOpen: onOpenForDeleteModal,
    onClose: onCloseForDeleteModal
  } = useDisclosure()

  const { toggleColorMode, colorMode } = useColorMode()

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Change theme',
      text: (
        <Button
          onClick={toggleColorMode}
          rightIcon={<Icon variant={colorMode === 'light' ? 'moon' : 'sun'} />}
        >
          {colorMode === 'light' ? 'Dark theme' : 'Light theme'}
        </Button>
      )
    },
    {
      heading: 'Disconnect repositories',
      text: (
        <Button
          isDisabled={!user}
          isLoading={isLoadingForDisconnecting}
          onClick={async () => {
            try {
              await disconnectRepositoriesMutation()
              await queryClient.invalidateQueries(
                getQueryKey(trpc.client.getCurrentUser)
              )
              showSuccessToast('Successfully disconnected repositories')
            } catch {
              showErrorToast('Cannot disconnect repositories')
            }
          }}
          colorScheme="red"
        >
          Disconnect
        </Button>
      )
    },
    {
      heading: 'Delete profile',
      text: (
        <Button
          isDisabled={!user}
          onClick={onOpenForDeleteModal}
          colorScheme="red"
        >
          Delete
        </Button>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader position="relative">
          <Heading size="md">
            {isLoading ? (
              <Skeleton display="inline-block">Settings</Skeleton>
            ) : (
              'Settings'
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

      <DeleteUserConfirmation
        user={user}
        isOpen={isOpenForDeleteModal}
        onCancel={onCloseForDeleteModal}
        onConfirm={() => {
          onCloseForDeleteModal()
          logout()
        }}
      />
    </>
  )
}
