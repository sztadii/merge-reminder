import {
  AddIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  ExternalLinkIcon,
  MoonIcon,
  RepeatIcon,
  SunIcon,
  WarningTwoIcon
} from '@chakra-ui/icons'

const icons = {
  chevronDown: ChevronDownIcon,
  chevronRight: ChevronRightIcon,
  chevronLeft: ChevronLeftIcon,
  add: AddIcon,
  moon: MoonIcon,
  sun: SunIcon,
  externalLink: ExternalLinkIcon,
  edit: EditIcon,
  warning: WarningTwoIcon,
  repeat: RepeatIcon
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
