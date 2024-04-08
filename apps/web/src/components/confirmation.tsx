import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type ConfirmationProps = {
  isOpen: boolean
  onClose: () => void
  confirmButton: {
    onClick: ButtonProps['onClick']
    name: string
    colorScheme: ButtonProps['colorScheme']
  }
  title: string
  description: ReactNode
}

export function Confirmation({
  isOpen,
  onClose,
  title,
  description,
  confirmButton
}: ConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Close
          </Button>

          <Button
            onClick={confirmButton.onClick}
            colorScheme={confirmButton.colorScheme}
          >
            {confirmButton.name}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}