import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
  header: ReactNode
  body: ReactNode
  footer: ReactNode
}

export function Drawer({ isOpen, onClose, header, body, footer }: DrawerProps) {
  return (
    <ChakraDrawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>{header}</DrawerHeader>

        <DrawerBody>{body}</DrawerBody>

        <DrawerFooter>{footer}</DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  )
}
