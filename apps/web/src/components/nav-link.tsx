import { Button } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Link, useLocation } from 'wouter'

type NavLinkProps = {
  children: ReactNode
  href: string
}

export function NavLink({ children, href }: NavLinkProps) {
  const [location] = useLocation()
  const isActive = location.startsWith(href)

  return (
    <Button as={Link} href={href} variant="link" isActive={isActive}>
      {children}
    </Button>
  )
}
