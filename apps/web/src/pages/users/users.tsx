import { Divider } from '@chakra-ui/react'

import { CreateUserDrawer } from './components/create-user-drawer'
import { ViewUsersSection } from './components/view-users-section'

export function Users() {
  return (
    <>
      <CreateUserDrawer />

      <Divider my={4} />

      <ViewUsersSection />
    </>
  )
}
