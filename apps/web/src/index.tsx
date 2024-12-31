import { ColorModeScript } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'

import { App } from '@apps/web/app'
import { theme } from '@apps/web/chakra-ui'

const root = createRoot(document.getElementById('app') as HTMLElement)

root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
)
