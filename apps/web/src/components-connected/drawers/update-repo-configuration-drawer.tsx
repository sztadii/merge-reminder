import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Switch
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useMemo, useState } from 'react'

import { Drawer } from 'src/components/drawer'
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
  baseBranch?: string
  headBranch?: string
  isIgnored: boolean
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
      configuration?.repos?.some(
        iteratedRepo => iteratedRepo.repoId === repo?.id
      ),
    [configuration, repo]
  )

  useEffect(() => {
    if (!repo) return
    if (!configuration) return

    const formValues = configuration.repos.find(
      iteratedRepo => iteratedRepo.repoId === repo?.id
    )

    setFormValues(formValues)
  }, [configuration, repo, isOpen])

  async function updateConfiguration(isDelete: boolean) {
    if (!repo) return
    if (!configuration) return

    try {
      setIsPending(true)

      const repos = getReposToSend(isDelete)

      await updateReposConfigurationMutation({
        repos
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

  function getReposToSend(isDelete: boolean) {
    if (!repo) return []
    if (!configuration) return []

    const trimmedValues = trimObjectValues({
      isIgnored: !!formValues?.isIgnored,
      headBranch: formValues?.headBranch,
      baseBranch: formValues?.baseBranch
    })
    const hasCorrectFormData = hasCorrectData()
    const hasEmptyData = !hasCorrectFormData

    // Remove repo from configuration
    if (isDelete || (hasEmptyData && hasRepoInConfiguration)) {
      return configuration.repos.filter(iteratedRepo => {
        return iteratedRepo.repoId !== repo.id
      })
    }

    const updatedRepo = {
      repoId: repo.id,
      ...trimmedValues
    }

    // Update repo in configuration
    if (hasCorrectFormData && hasRepoInConfiguration) {
      return configuration.repos.map(iteratedRepo => {
        return iteratedRepo.repoId === repo.id ? updatedRepo : iteratedRepo
      })
    }

    // Add repo to configuration
    if (hasCorrectFormData) {
      return [...configuration.repos, updatedRepo]
    }

    // Return empty repos
    return []
  }

  function hasCorrectData() {
    if (formValues?.isIgnored === true) return true

    return formValues?.headBranch && formValues?.baseBranch
  }

  function handleClose() {
    setFormValues(undefined)
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      header={<>Update {repo?.name}</>}
      body={
        <>
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

          <FormControl mt={8}>
            <FormLabel>Ignore</FormLabel>
            <Switch
              size="lg"
              isChecked={formValues?.isIgnored}
              onChange={e =>
                setFormValues({
                  ...formValues,
                  isIgnored: e.target.checked
                })
              }
            />
          </FormControl>
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {hasRepoInConfiguration && (
            <Button
              ml={2}
              colorScheme="red"
              isLoading={isPending}
              onClick={() => updateConfiguration(true)}
            >
              Reset
            </Button>
          )}
          <Button
            ml={2}
            isLoading={isPending}
            onClick={() => updateConfiguration(false)}
          >
            Save
          </Button>
        </>
      }
    />
  )
}
