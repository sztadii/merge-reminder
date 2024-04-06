import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import { Drawer } from 'src/components/drawer'
import { ProjectResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type UpdateProjectDrawerProps = {
  project?: ProjectResponse
  isOpen: boolean
  onClose: () => void
}

export function UpdateProjectDrawer({
  project,
  isOpen,
  onClose
}: UpdateProjectDrawerProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateProjectMutation } =
    trpc.projects.update.useMutation()

  const [isPending, setIsPending] = useState(false)
  const [projectName, setProjectName] = useState<string>()

  useEffect(() => {
    if (!project) return

    setProjectName(project.name)
  }, [project])

  const resetProjectName = () => {
    setProjectName(undefined)
  }

  const handleOnClose = () => {
    resetProjectName()
    onClose()
  }

  const updateProject = async () => {
    if (!projectName || !project) return

    try {
      setIsPending(true)
      await updateProjectMutation({
        id: project.id,
        name: projectName
      })
      await queryClient.invalidateQueries(getQueryKey(trpc.projects.findAll))
      handleOnClose()
    } catch {
      showErrorToast('Can not update project')
    } finally {
      setIsPending(false)
    }
  }

  const isSubmitDisabled =
    projectName?.length === 0 || projectName === project?.name

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleOnClose}
      header="Update project"
      body={
        <FormControl>
          <FormLabel>Project name</FormLabel>
          <Input
            defaultValue={projectName}
            placeholder="Type..."
            onChange={e => setProjectName(e.target.value)}
          />
        </FormControl>
      }
      footer={
        <>
          <Button variant="outline" mr={2} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            isDisabled={isSubmitDisabled}
            onClick={updateProject}
          >
            Save
          </Button>
        </>
      }
    />
  )
}
