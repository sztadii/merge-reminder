import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Link,
  Skeleton,
  Tag,
  useDisclosure
} from '@chakra-ui/react'
import { useMemo } from 'react'

import { UpdateReposConfigurationDrawer } from 'src/components-connected/drawers/update-repos-configuration-drawer'
import { DetailsGrid, DetailsGridProps } from 'src/components/details-grid'
import { Icon } from 'src/components/icon'
import { Table, TableProps } from 'src/components/table'
import { Text } from 'src/components/text'
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

  const {
    isOpen: isOpenForUpdateDrawer,
    onOpen: onOpenForUpdateDrawer,
    onClose: onCloseForUpdateDrawer
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
            content: repository => {
              return (
                <Flex gap={2} alignItems="center">
                  <Link
                    href={repository.url}
                    isExternal
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Text>{repository.name}</Text>
                    <Icon variant="externalLink" />
                  </Link>
                </Flex>
              )
            }
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

              return (
                <Flex gap={2} alignItems="center">
                  {repoConfiguration ? (
                    <>
                      <Tag>{repoConfiguration.headBranch}</Tag>
                      <Tag>{repoConfiguration.baseBranch}</Tag>
                    </>
                  ) : (
                    'N/A'
                  )}
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

          <Box position="absolute" top={4} right={4}>
            {isLoadingForConfiguration ? (
              <Skeleton>
                <IconButton aria-label="update profile" />
              </Skeleton>
            ) : (
              <IconButton
                aria-label="update configuration"
                isDisabled={!configuration}
                onClick={onOpenForUpdateDrawer}
                icon={<Icon variant="edit" />}
              />
            )}
          </Box>
        </CardHeader>

        <CardBody>
          <Box mb={8}>
            <DetailsGrid
              details={details}
              isLoading={isLoadingForConfiguration}
              error={errorForConfiguration?.message}
            />
          </Box>

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
        isOpen={isOpenForUpdateDrawer}
        onClose={onCloseForUpdateDrawer}
      />
    </>
  )
}
