import { IconButton, useColorMode } from '@chakra-ui/react'

import { Icon } from 'src/components/icon'

export function ToggleThemeButton() {
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <IconButton
      onClick={toggleColorMode}
      icon={<Icon variant={colorMode === 'light' ? 'sun' : 'moon'} />}
      aria-label=""
    />
  )
}
