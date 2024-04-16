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
    text: string
    colorScheme?: ButtonProps['colorScheme']
    isDisabled?: boolean
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
            colorScheme={confirmButton.colorScheme || 'red'}
            isDisabled={confirmButton.isDisabled}
          >
            {confirmButton.text}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
