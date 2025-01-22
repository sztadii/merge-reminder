import { Box, Button, Container, Flex, Heading } from '@chakra-ui/react'
import { Link } from 'wouter'

import { Text } from '@apps/web/components/text'
import { routerPaths } from '@apps/web/router'

export function Landing() {
  return (
    <Flex
      height="100dvh"
      width="100dvw"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container>
        <Box textAlign="center">
          <Text color="gray.500">Welcome to</Text>

          <Heading size="md" color="gray.500" mb={4}>
            Merge Reminder
          </Heading>
        </Box>

        <Text color="gray.500" mb={4}>
          The app is designed to solve a very common problem during development.{' '}
          <Text color="white">If you use GitFlow</Text> during development, you
          typically work with two branches: master and develop. The develop
          branch is used for ongoing development, while the master branch is
          used for deploying to production.When a release is ready, the develop
          branch is merged into master. If any issues arise in production, they
          are usually fixed directly there and then merged back into develop.{' '}
          <Text color="white">If fixes are not merged back into develop</Text>,
          it can lead to <Text color="white">merge conflicts</Text>, which are
          time-consuming. Time equals money, and that's why this project aims to
          streamline the development process.
        </Text>

        <Box position="absolute" right={4} top={4}>
          <Button as={Link} to={routerPaths.dashboard.path}>
            Dashboard
          </Button>
        </Box>
      </Container>
    </Flex>
  )
}
