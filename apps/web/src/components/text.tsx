import { Text as TextComponent, TextProps } from '@chakra-ui/react'
import React, { forwardRef } from 'react'

// The Chakra UI's <Text /> component is rendered using a <p> (paragraph) tag by default,
// which can cause some React validation issues.
// To avoid these issues, we need to render it with the as="span" prop.
// So far, I have not seen any possible way to change the global configuration,
// which is why this component is necessary.

export const Text = forwardRef<HTMLSpanElement, TextProps>((props, ref) => {
  return <TextComponent as="span" ref={ref} {...props} />
})
