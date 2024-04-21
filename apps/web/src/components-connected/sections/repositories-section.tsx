import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

import { ResetReposConfigurationsButton } from 'src/components-connected/buttons/reset-repos-configurations-button'
import { UpdateRepoConfigurationDrawer } from 'src/components-connected/drawers/update-repo-configuration-drawer'
import { UpdateReposConfigurationDrawer } from 'src/components-connected/drawers/update-repos-configuration-drawer'
import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { Table, TableProps } from 'src/components/table'
import { RepositoryResponse } from 'src/schemas'
import { trpc } from 'src/trpc'

export function RepositoriesSection() {
  const {
    data: repositoriesData,
    isLoading: isLoadingForRepositories,
    error: errorForRepositories
  } = trpc.client.getCurrentRepositories.useQuery()

  const repositories = repositoriesData || []

  const {
    data: configuration,
    isLoading: isLoadingForConfiguration,
    error: errorForConfiguration
  } = trpc.client.getCurrentRepositoriesConfiguration.useQuery()

  const [repo, setRepo] = useState<RepositoryResponse | undefined>()

  const {
    isOpen: isOpenForUpdateAllDrawer,
    onOpen: onOpenForUpdateAllDrawer,
    onClose: onCloseForUpdateAllDrawer
  } = useDisclosure()

  const {
    isOpen: isOpenForUpdateSingleDrawer,
    onOpen: onOpenForUpdateSingleDrawer,
    onClose: onCloseForUpdateSingleDrawer
  } = useDisclosure()

  const details: DetailsGridProps['details'] = [
    {
      heading: 'Default head branch',
      text: configuration?.headBranch
    },
    {
      heading: 'Default base branch',
      text: configuration?.baseBranch
    },
    {
      heading: 'Exclude repos without required branches',
      text: configuration?.excludeReposWithoutRequiredBranches ? 'Yes' : 'No'
    }
  ]

  const tableColumns: TableProps<typeof repositories>['columns'] =
    useMemo(() => {
      return [
        {
          id: 'name',
          width: {
            base: '150px',
            lg: 'auto'
          },
          headingCell: {
            skeleton: () => <Skeleton>Loading</Skeleton>,
            content: () => 'Repo'
          },
          rowCell: {
            skeleton: () => <Skeleton>Loading</Skeleton>,
            content: repository => repository.name
          }
        },
        {
          id: 'configuration',
          width: {
            base: '300px',
            lg: 'auto'
          },
          headingCell: {
            skeleton: () => <Skeleton>Loading</Skeleton>,
            content: () => 'Configuration'
          },
          rowCell: {
            skeleton: () => <Skeleton>Loading</Skeleton>,
            content: repository => {
              if (!configuration) return

              const repoConfiguration = configuration.repos.find(
                iteratedRepo => iteratedRepo.repoId === repository.id
              )

              function openEditDrawer() {
                setRepo(repository)
                onOpenForUpdateSingleDrawer()
              }

              return (
                <Flex
                  cursor="pointer"
                  onClick={openEditDrawer}
                  gap={2}
                  alignItems="center"
                >
                  {repoConfiguration ? (
                    <>
                      <Button size="xs">{repoConfiguration.headBranch}</Button>
                      <Button size="xs">{repoConfiguration.baseBranch}</Button>
                    </>
                  ) : (
                    <Button size="xs">N/A</Button>
                  )}
                  <Icon variant="edit" color="gray.500" />
                </Flex>
              )
            }
          }
        }
      ]
    }, [configuration])

  return (
    <>
      <Card>
        <CardHeader position="relative">
          <Heading size="md">
            {isLoadingForConfiguration ? (
              <Skeleton display="inline-block">Repositories</Skeleton>
            ) : (
              'Repositories'
            )}
          </Heading>

          {configuration && (
            <Box position="absolute" top={4} right={4}>
              <Flex gap={4}>
                {!!repositories.length && !!configuration.repos.length && (
                  <ResetReposConfigurationsButton />
                )}
                <IconButton
                  aria-label="update configuration"
                  onClick={onOpenForUpdateAllDrawer}
                  icon={<Icon variant="edit" />}
                />
              </Flex>
            </Box>
          )}
        </CardHeader>

        <CardBody>
          <DetailsGrid
            details={details}
            isLoading={isLoadingForConfiguration}
            error={errorForConfiguration?.message}
          />

          <Divider my={8} />

          <Table
            columns={tableColumns}
            rows={repositories}
            numberOfSkeletonRows={6}
            isLoading={isLoadingForRepositories}
            errorMessage={errorForRepositories?.message}
          />
        </CardBody>
      </Card>

      <UpdateReposConfigurationDrawer
        configuration={configuration}
        isOpen={isOpenForUpdateAllDrawer}
        onClose={onCloseForUpdateAllDrawer}
      />

      <UpdateRepoConfigurationDrawer
        repo={repo}
        configuration={configuration}
        isOpen={isOpenForUpdateSingleDrawer}
        onClose={() => {
          setRepo(undefined)
          onCloseForUpdateSingleDrawer()
        }}
      />
    </>
  )
}