import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  useDisclosure
} from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'
import { Link } from 'wouter'

import { Icon } from 'src/components/icon'
import { SpinnerWithLabel } from 'src/components/spinner-with-label/spinner-with-label'
import { Text } from 'src/components/text'
import { usePendingMutationVariables } from 'src/hooks/use-pending-mutations-variables'
import { routerPaths } from 'src/router'
import { ProjectResponse } from 'src/schemas'
import { showErrorToast } from 'src/toasts'
import { trpc } from 'src/trpc'

import { UpdateProjectDrawer } from '../update-project-drawer'

export function ViewProjectsSection() {
  const [project, setProject] = useState<ProjectResponse | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const queryClient = useQueryClient()
  const pendingMutationVariables = usePendingMutationVariables()

  const { data: projects = [], isLoading: isLoadingProjectList } =
    trpc.projects.findAll.useQuery()

  const { mutateAsync: deleteProject } = trpc.projects.deleteById.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries(getQueryKey(trpc.projects.findAll))
    },
    onError() {
      showErrorToast('Can not delete project')
    }
  })

  return (
    <>
      <UpdateProjectDrawer
        project={project}
        isOpen={isOpen}
        onClose={() => {
          setProject(undefined)
          onClose()
        }}
      />

      <SimpleGrid columns={3} spacing={4}>
        {isLoadingProjectList &&
          new Array(6).fill(null).map((_, index) => {
            return (
              <Box key={index} position="relative">
                <Card>
                  <CardBody>
                    <Flex>
                      <Text fontSize="xs" color="gray.400">
                        <Skeleton>Project name</Skeleton>
                      </Text>
                    </Flex>

                    <Button mt={1} variant="link">
                      <Skeleton>Project is loading</Skeleton>
                    </Button>
                  </CardBody>
                </Card>

                <Box position="absolute" top={2} right={2}>
                  <Skeleton>
                    <Icon variant="chevronDown" />
                  </Skeleton>
                </Box>
              </Box>
            )
          })}

        {!isLoadingProjectList && !projects.length && (
          <Box>
            <Card>
              <CardBody>
                <Text>No projects</Text>
              </CardBody>
            </Card>
          </Box>
        )}

        {projects.map(project => {
          const projectId = project.id
          const isCurrentProjectDeleting = pendingMutationVariables.some(
            variable => variable === projectId
          )

          return (
            <Box position="relative" key={projectId}>
              <Card>
                <CardBody>
                  <Flex gap={2}>
                    <Text fontSize="xs" color="gray.400">
                      Project name
                    </Text>

                    {isCurrentProjectDeleting && (
                      <SpinnerWithLabel label="Deleting" color="red.400" />
                    )}
                  </Flex>

                  <Button
                    mt={1}
                    as={Link}
                    to={routerPaths.project.generateURL(projectId)}
                    variant="link"
                    rightIcon={<Icon variant="chevronRight" />}
                    isActive
                  >
                    {project.name}
                  </Button>

                  <Box position="absolute" top={2} right={2}>
                    <Menu placement="left-start">
                      <MenuButton>
                        <Icon variant="chevronDown" />
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => deleteProject(projectId)}>
                          Delete project
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setProject(project)
                            onOpen()
                          }}
                        >
                          Edit
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          )
        })}
      </SimpleGrid>
    </>
  )
}
