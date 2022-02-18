import { Employee, User } from '@prisma/client'

export type Permission = `read:employee.${keyof Employee}`

let available: Permission[]

try {
  if (!process.env.RESTRICTED_FIELDS) {
    throw new Error('Required environment variable RESTRICTED_FIELDS not present')
  }

  const arr = JSON.parse(process.env.RESTRICTED_FIELDS)

  if (!Array.isArray(arr)) {
    throw new Error('Environment variable RESTRICTED_FIELDS must be an array')
  } else if (arr.some(elem => typeof elem !== 'string')) {
    throw new Error('Environment variable RESTRICTED_FIELDS must be an array of strings')
  }

  // Disabling this because it causes a false flag
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  available = arr.map(field => `read:employee.${field}` as Permission)
} catch (err) {
  logger.fatal(`Could not parse restricted fields: ${err}`)
  process.exit(1)
}

export const getAvailablePermissions = (): Permission[] => available

export const isSuperuser = (user: User): boolean => user.isSuperuser ?? false

export const hasPermission = (permission: Permission, user: User): boolean =>
  isSuperuser(user) || user.permissions.includes(permission)
