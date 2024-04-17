import { createStandaloneToast } from '@chakra-ui/react'

const { ToastContainer, toast } = createStandaloneToast()

export function showErrorToast(text: string, options?: ToastOptions) {
  toast({
    status: 'error',
    title: 'Error',
    description: text,
    position: 'top-right',
    duration: options?.durationInMilliseconds || 3_000
  })
}

export function showSuccessToast(text: string, options?: ToastOptions) {
  toast({
    status: 'success',
    title: 'Success',
    description: text,
    position: 'top-right',
    duration: options?.durationInMilliseconds || 3_000
  })
}

type ToastOptions = {
  durationInMilliseconds: number
}

export const ToastProvider = ToastContainer
