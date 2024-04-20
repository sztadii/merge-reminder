import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useMemo, useState } from 'react'

import { trimObjectValues } from 'src/helpers'
import { RepoConfigurationResponse, RepositoryResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

type UpdateRepoConfigurationDrawerProps = {
  repo?: RepositoryResponse
  configuration?: RepoConfigurationResponse
  isOpen: boolean
  onClose: () => void
}

type FormValuesRequired = {
  baseBranch: string
  headBranch: string
}

type FormValuesInitial = Partial<FormValuesRequired>

export function UpdateRepoConfigurationDrawer({
  repo,
  configuration,
  isOpen,
  onClose
}: UpdateRepoConfigurationDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [formValues, setFormValues] = useState<FormValuesInitial | undefined>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateReposConfigurationMutation } =
    trpc.client.updateCurrentRepositoriesConfiguration.useMutation()

  const hasRepoInConfiguration = useMemo(
    () =>
      configuration?.repos.find(
        iteratedRepo => iteratedRepo.repoId === repo?.id
      ),
    [configuration, repo]
  )

  const hasMissingFormValues =
    !formValues?.headBranch || !formValues?.baseBranch

  useEffect(() => {
    if (!repo) return
    if (!configuration) return

    const formValues = configuration.repos.find(
      iteratedRepo => iteratedRepo.repoId === repo?.id
    )

    setFormValues(formValues)
  }, [configuration, repo, isOpen])

  async function updateConfiguration(isDelete?: boolean) {
    debugger
    if (!repo) return
    if (!configuration) return
    if (hasMissingFormValues) return

    try {
      setIsPending(true)

      const trimmedValues = trimObjectValues({
        headBranch: formValues?.headBranch,
        baseBranch: formValues?.baseBranch
      } as FormValuesRequired)

      let reposYoUpdate: RepoConfigurationResponse['repos'] = []

      const isReposConfigurationEmpty = configuration.repos.length === 0

      if (isReposConfigurationEmpty) {
        reposYoUpdate = [
          {
            repoId: repo.id,
            ...trimmedValues
          }
        ]
      }

      if (hasRepoInConfiguration) {
        reposYoUpdate = configuration.repos.map(iteratedRepo => {
          if (iteratedRepo.repoId !== repo.id) return iteratedRepo

          return {
            repoId: repo.id,
            ...trimmedValues
          }
        })
      }

      if (isDelete) {
        reposYoUpdate = configuration.repos.filter(iteratedRepo => {
          return iteratedRepo.repoId !== repo.id
        })
      }

      await updateReposConfigurationMutation({
        repos: reposYoUpdate
      })

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentRepositoriesConfiguration)
      )

      queryClient
        .invalidateQueries(getQueryKey(trpc.client.getCurrentWarnings))
        .then()

      handleClose()
      setFormValues(undefined)
    } catch {
      showErrorToast('Can not update repo configuration.')
    } finally {
      setIsPending(false)
    }
  }

  function handleClose() {
    setFormValues(undefined)
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Update {repo?.name}</DrawerHeader>

        <DrawerBody>
          <FormControl>
            <FormLabel>Head branch</FormLabel>
            <Input
              value={formValues?.headBranch || ''}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  headBranch: e.target.value
                })
              }
            />

            <FormHelperText>Usually the production branch:</FormHelperText>

            <Flex alignItems="center" gap={2} mt={2}>
              <Button
                size="xs"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    headBranch: 'master'
                  })
                }}
              >
                master
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    headBranch: 'main'
                  })
                }}
              >
                main
              </Button>
            </Flex>
          </FormControl>

          <FormControl mt={8}>
            <FormLabel>Base branch</FormLabel>
            <Input
              value={formValues?.baseBranch || ''}
              placeholder="Type..."
              onChange={e =>
                setFormValues({
                  ...formValues,
                  baseBranch: e.target.value
                })
              }
            />

            <FormHelperText>Usually the development branch:</FormHelperText>

            <Flex alignItems="center" gap={2} mt={2}>
              <Button
                size="xs"
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    baseBranch: 'develop'
                  })
                }}
              >
                develop
              </Button>
            </Flex>
          </FormControl>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={2} onClick={handleClose}>
            Cancel
          </Button>
          {hasRepoInConfiguration && (
            <Button
              mr={2}
              colorScheme="red"
              isLoading={isPending}
              isDisabled={hasMissingFormValues}
              onClick={() => updateConfiguration(true)}
            >
              Delete
            </Button>
          )}
          <Button
            isLoading={isPending}
            isDisabled={hasMissingFormValues}
            onClick={() => updateConfiguration()}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
