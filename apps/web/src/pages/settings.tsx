import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { Link } from 'wouter'

import { BasicSettingsSection } from 'src/components-connected/sections/basic-settings-section'
import { routerPaths } from 'src/router'

export function Settings() {
  return (
    <>
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={routerPaths.dashboard.path}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <BasicSettingsSection />
    </>
  )
}
