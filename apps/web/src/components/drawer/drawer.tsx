import {
  Drawer as ChakraDrawer,
  DrawerProps as ChakraDrawerProps,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type DrawerProps = Pick<ChakraDrawerProps, 'isOpen' | 'onClose'> & {
  header: string
  body: ReactNode
  footer: ReactNode
}

export function Drawer({ header, body, footer, isOpen, onClose }: DrawerProps) {
  return (
    <ChakraDrawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{header}</DrawerHeader>

        <DrawerBody>{body}</DrawerBody>

        <DrawerFooter>{footer}</DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  )
}
