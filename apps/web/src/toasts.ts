import { createStandaloneToast } from '@chakra-ui/react'

const { ToastContainer, toast } = createStandaloneToast()

export function showErrorToast(text: string) {
  toast({
    status: 'error',
    title: 'Error',
    description: text,
    position: 'top-right'
  })
}

export function showSuccessToast(text: string) {
  toast({
    status: 'success',
    title: 'Success',
    description: text,
    position: 'top-right'
  })
}

export const ToastProvider = ToastContainer
