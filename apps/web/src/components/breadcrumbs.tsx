import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { Link } from 'wouter'

import { routerPaths } from '@apps/web/router'

type BreadcrumbsProps = {
  currentPage: string
}

export function Breadcrumbs({ currentPage }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to={routerPaths.dashboard.path}>
          Dashboard
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">{currentPage}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
