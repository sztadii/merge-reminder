import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'

import { Drawer } from 'src/components/drawer'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type CreateProjectDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectDrawer({
  isOpen,
  onClose
}: CreateProjectDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [projectName, setProjectName] = useState<string>()
  const queryClient = useQueryClient()
  const { mutateAsync: createProjectMutation } =
    trpc.projects.create.useMutation()

  const createProject = async () => {
    if (!projectName) return

    try {
      setIsPending(true)
      await createProjectMutation({
        name: projectName
      })
      await queryClient.invalidateQueries(getQueryKey(trpc.projects.findAll))
      setProjectName(undefined)
      onClose()
    } catch {
      showErrorToast('Can not create project')
    } finally {
      setIsPending(false)
    }
  }

  const isSubmitDisabled = projectName?.length === 0

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      header="Create new project"
      body={
        <FormControl>
          <FormLabel>Project name</FormLabel>
          <Input
            placeholder="Type..."
            onChange={e => setProjectName(e.target.value)}
          />
        </FormControl>
      }
      footer={
        <>
          <Button variant="outline" mr={2} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            isDisabled={isSubmitDisabled}
            onClick={createProject}
          >
            Save
          </Button>
        </>
      }
    />
  )
}
