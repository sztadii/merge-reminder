import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
  Tag
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import {
  RepoConfigurationResponse,
  RepoConfigurationUpdateRequest
} from '@apps/shared/schemas'

import { Drawer } from '@apps/web/components/drawer'
import { trimObjectValues } from '@apps/web/helpers'
import { showErrorToast } from '@apps/web/libs/toasts'
import { trpc } from '@apps/web/libs/trpc'

type UpdateRepoConfigurationDrawerProps = {
  configuration?: RepoConfigurationResponse
  isOpen: boolean
  onClose: () => void
}

type FormValuesRequired = RepoConfigurationUpdateRequest

type FormValuesInitial = Partial<FormValuesRequired>

export function UpdateReposConfigurationDrawer({
  configuration,
  isOpen,
  onClose
}: UpdateRepoConfigurationDrawerProps) {
  const [isPending, setIsPending] = useState(false)
  const [formValues, setFormValues] = useState<FormValuesInitial | undefined>()
  const queryClient = useQueryClient()
  const { mutateAsync: updateReposConfigurationMutation } =
    trpc.client.updateCurrentRepositoriesConfiguration.useMutation()

  const hasMissingFormValues =
    !formValues?.headBranch || !formValues?.baseBranch

  useEffect(() => {
    if (!configuration) return

    setFormValues(configuration)
  }, [configuration, isOpen])

  async function updateConfiguration() {
    if (!configuration) return
    if (hasMissingFormValues) return

    try {
      setIsPending(true)

      const trimmedValues = trimObjectValues(formValues)
      await updateReposConfigurationMutation(
        trimmedValues as FormValuesRequired
      )

      await queryClient.invalidateQueries(
        getQueryKey(trpc.client.getCurrentRepositoriesConfiguration)
      )

      queryClient
        .invalidateQueries(getQueryKey(trpc.client.getCurrentWarnings))
        .then()

      handleClose()
      setFormValues(undefined)
    } catch {
      showErrorToast('Can not update configuration.')
    } finally {
      setIsPending(false)
    }
  }

  function handleClose() {
    setFormValues(undefined)
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      header={<>Update configuration</>}
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

            <FormHelperText>Usually the production branch</FormHelperText>

            <Flex alignItems="center" gap={2} mt={2}>
              <Tag>master</Tag>
              <Tag>main</Tag>
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

            <FormHelperText>Usually the development branch</FormHelperText>

            <Flex alignItems="center" gap={2} mt={2}>
              <Tag>develop</Tag>
            </Flex>
          </FormControl>

          <FormControl mt={8}>
            <FormLabel>Ignore repos without required branches</FormLabel>
            <Switch
              size="lg"
              isChecked={formValues?.excludeReposWithoutRequiredBranches}
              onChange={e =>
                setFormValues({
                  ...formValues,
                  excludeReposWithoutRequiredBranches: e.target.checked
                })
              }
            />

            <FormHelperText>Helpful during the initial setup</FormHelperText>
          </FormControl>
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            ml={2}
            isLoading={isPending}
            isDisabled={hasMissingFormValues}
            onClick={updateConfiguration}
            colorScheme="teal"
          >
            Save
          </Button>
        </>
      }
    />
  )
}
