import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton
} from '@chakra-ui/react'

import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

import { DetailsGrid, DetailsGridProps } from '../components/details-grid'

export function RepositoriesSection() {
  const {
    data: repositories,
    isLoading: isLoadingForRepositories,
    error: errorForRepositories
  } = trpc.client.getCurrentRepositories.useQuery()

  const {
    data: configuration,
    isLoading: isLoadingForConfiguration,
    error: errorForConfiguration
  } = trpc.client.getCurrentRepositoriesConfiguration.useQuery()

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

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Repositories</Heading>
        </CardHeader>

        <CardBody>
          <Box mb={8}>
            <DetailsGrid
              details={details}
              isLoading={isLoadingForConfiguration}
              error={errorForConfiguration?.message}
            />
          </Box>

          {isLoadingForRepositories && (
            <Accordion allowMultiple>
              {new Array(2).fill(null).map((_, index) => {
                return (
                  <AccordionItem key={index}>
                    <AccordionButton
                      px={0}
                      py={4}
                      justifyContent="space-between"
                    >
                      <Flex alignItems="center" gap={4}>
                        <Skeleton>Name</Skeleton>
                        <Skeleton width={200}>Loading</Skeleton>
                      </Flex>

                      <Skeleton>
                        <AccordionIcon />
                      </Skeleton>
                    </AccordionButton>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}

          {errorForRepositories && (
            <Alert status="error">
              <AlertIcon />
              {errorForRepositories.message}
            </Alert>
          )}

          <Accordion allowMultiple>
            {repositories?.map(repository => {
              return (
                <AccordionItem key={repository.name}>
                  <AccordionButton px={0} py={4} justifyContent="space-between">
                    <Flex gap={4}>
                      <Text fontWeight="bold" color="gray.400">
                        Name
                      </Text>
                      {repository.name}
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel px={0} pb={4}>
                    Other stuff
                  </AccordionPanel>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardBody>
      </Card>
    </>
  )
}
