import { Button, Divider, useDisclosure } from '@chakra-ui/react'

import { CreateUpdateUserDrawer } from './components/create-update-user-drawer'
import { ViewUsersSection } from './components/view-users-section'

export function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Create</Button>

      <CreateUpdateUserDrawer isOpen={isOpen} onClose={onClose} />

      <Divider my={4} />

      <ViewUsersSection />
    </>
  )
}
