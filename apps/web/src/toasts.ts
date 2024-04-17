import { createStandaloneToast } from '@chakra-ui/react'

const { ToastContainer, toast } = createStandaloneToast()

export function showErrorToast(text: string, durationInMilliseconds?: number) {
  toast({
    status: 'error',
    title: 'Error',
    description: text,
    position: 'top-right',
    duration: durationInMilliseconds
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
