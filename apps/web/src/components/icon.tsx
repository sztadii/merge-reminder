import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons'

const icons = {
  chevronDown: ChevronDownIcon,
  chevronRight: ChevronRightIcon,
  add: AddIcon,
  moon: MoonIcon,
  sun: SunIcon,
  externalLink: ExternalLinkIcon
}

const sizes = {
  sm: 12,
  md: 16,
  lg: 20
}

type IconProps = {
  variant: keyof typeof icons
  size?: 'sm' | 'md' | 'lg'
}

export function Icon({ variant, size = 'md' }: IconProps) {
  const Component = icons[variant]
  const sizeInPixels = `${sizes[size]}px`

  return <Component w={sizeInPixels} />
}
