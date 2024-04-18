import { Button, useColorMode } from '@chakra-ui/react'

import { Icon } from 'src/components/icon'

export function ToggleThemeButton() {
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <Button
      onClick={toggleColorMode}
      rightIcon={<Icon variant={colorMode === 'light' ? 'moon' : 'sun'} />}
    >
      {colorMode === 'light' ? 'Dark' : 'Light'}
    </Button>
  )
}
