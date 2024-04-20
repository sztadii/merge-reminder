import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Skeleton
} from '@chakra-ui/react'

import { Text } from 'src/components/text'
import { trpc } from 'src/trpc'

export function RepositoriesSection() {
  const {
    data: repositories,
    isLoading,
    error
  } = trpc.client.getCurrentRepositories.useQuery()

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Repositories</Heading>
        </CardHeader>

        <CardBody>
          {isLoading && (
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

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error.message}
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
