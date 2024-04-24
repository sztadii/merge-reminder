import {
  AddIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
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
  delete: DeleteIcon,
  bell: BellIcon,
  repeat: RepeatIcon,
  check: CheckIcon
}

const sizes = {
  sm: 12,
  md: 16,
  lg: 20
}

type IconProps = {
  variant: keyof typeof icons
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function Icon({ variant, size = 'md', color }: IconProps) {
  const Component = icons[variant]
  const sizeInPixels = `${sizes[size]}px`

  return <Component color={color} w={sizeInPixels} />
}
