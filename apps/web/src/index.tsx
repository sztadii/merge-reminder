import { ColorModeScript } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'

import { App, theme } from 'src/app'

const root = createRoot(document.getElementById('app') as HTMLElement)

root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
)
