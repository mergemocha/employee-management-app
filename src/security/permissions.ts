import { Employee, User } from '@prisma/client'

export type Permission = `read:employee.${keyof Employee}`

let available: Permission[]

load()

export function load (): void {
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

    available = fmtKeysToPermissions(arr)
  } catch (err) {
    logger.fatal(`Could not parse restricted fields: ${err}`)
    process.exit(1)
  }
}

export function fmtKeysToPermissions (keys: Array<keyof Employee>): Permission[] {
  return keys.map(key => convertKeyToPermission(key))
}

export function convertKeyToPermission (key: keyof Employee): Permission {
  return `read:employee.${key}`
}

export const getAvailablePermissions = (): Permission[] => available

export const isSuperuser = (user: User): boolean => user.isSuperuser ?? false

// Disabling this because it causes a false flag (would be needless layers of complication to declare permissions as a relation)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const getPermissions = (user: User): Permission[] => isSuperuser(user) ? getAvailablePermissions() : user.permissions as Permission[]

export const hasPermission = (permission: Permission, user: User): boolean =>
  isSuperuser(user) || user.permissions.includes(permission)
