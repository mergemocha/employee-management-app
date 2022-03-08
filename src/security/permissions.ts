import { Employee, User } from '@prisma/client'

export type Permission = `read:employee.${keyof Employee}`

let available: Permission[]

/**
 * Loads and parses restricted fields from the RESTRICTED_FIELDS environment variable.
 */
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

/**
 * Formats an array of keys from the {@link Employee} object into {@link Permission}s.
 *
 * @param keys - Keys to convert
 * @returns Array of {@link Permission} strings
 */
export function fmtKeysToPermissions (keys: Array<keyof Employee>): Permission[] {
  return keys.map(key => convertKeyToPermission(key))
}

/**
 * Converts a singular key of the {@link Employee} object into a {@link Permission}.
 *
 * @param key - Key to convert
 * @returns A {@link Permission} string
 */
export function convertKeyToPermission (key: keyof Employee): Permission {
  return `read:employee.${key}`
}

/**
 * Returns all available {@link Permission}s.
 *
 * @returns All available {@link Permission}s
 */
export const getAvailablePermissions = (): Permission[] => available

/**
 * Checks whether a {@link User} is a superuser.
 *
 * @param user - The {@link User} to check
 * @returns Whether {@link User} is a superuser
 */
export const isSuperuser = (user: User): boolean => user.isSuperuser ?? false

/**
 * Returns the {@link Permission}s for a user. For superusers, this will always return all available {@link Permission}s.
 *
 * @param user - The {@link User} to check
 * @returns The array from {@link User#permissions}
 */
// Disabling this because it causes a false flag (would be needless layers of complication to declare permissions as a relation)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const getPermissions = (user: User): Permission[] => isSuperuser(user) ? getAvailablePermissions() : user.permissions as Permission[]

/**
 * Checks whether a {@link User} has a certain {@link Permission}.
 *
 * @param permission - The {@link Permission} to check for
 * @param user - The {@link User} to check on
 * @returns Whether the user has this permission
 */
export const hasPermission = (permission: Permission, user: User): boolean =>
  isSuperuser(user) || user.permissions.includes(permission)
