import { UserRole } from './schemas'

export type UserFromToken = {
  id: string
  name: string
  role: UserRole
  expiredAt: string
}
