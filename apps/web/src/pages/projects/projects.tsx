import { Button, Divider, useDisclosure } from '@chakra-ui/react'

import { CreateProjectDrawer } from './components/create-project-drawer'
import { ViewProjectsSection } from './components/view-projects-section'

export function Projects() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Create</Button>

      <CreateProjectDrawer isOpen={isOpen} onClose={onClose} />

      <Divider my={4} />

      <ViewProjectsSection />
    </>
  )
}
