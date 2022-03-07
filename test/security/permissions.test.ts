import * as mockProcess from 'jest-mock-process'
import { mock } from 'jest-mock-extended'
import { Employee, User } from '@prisma/client'
import pino from 'pino'
import * as permUtils from '../../src/security/permissions'

global.logger = pino()
global.logger.fatal = console.log

const mockExit = mockProcess.mockProcessExit()

afterEach(() => {
  process.removeAllListeners()
})

function overwriteEnv (value?: any): void {
  if (value === undefined) {
    delete process.env.RESTRICTED_FIELDS
  } else {
    process.env.RESTRICTED_FIELDS = JSON.stringify(value)
  }

  permUtils.load()
}

describe('Permissions utils', () => {
  it('Throws a fatal error if restricted fields are not present', () => {
    overwriteEnv(undefined)
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('Throws a fatal error if field is not an array', () => {
    overwriteEnv({})
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('Throws a fatal error if field is not an array of strings', () => {
    overwriteEnv([1, 2])

    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('Correctly lists available permissions', () => {
    overwriteEnv(['test'])
    expect(permUtils.getAvailablePermissions()).toEqual(['read:employee.test'])
  })

  it('Correctly tells whether a user is a superuser', () => {
    const fakeUser = mock<User>()

    fakeUser.isSuperuser = true
    expect(permUtils.isSuperuser(fakeUser)).toBe(true)

    fakeUser.isSuperuser = false
    expect(permUtils.isSuperuser(fakeUser)).toBe(false)
  })

  it('Gets permissions for a user and returns all permissions if user is superuser', () => {
    const fakeUser = mock<User>()
    fakeUser.isSuperuser = null

    overwriteEnv(['salary', 'secLevel'])

    const perms = permUtils.fmtKeysToPermissions(['salary'])
    fakeUser.permissions = perms

    expect(permUtils.getPermissions(fakeUser)).toEqual(perms)

    fakeUser.isSuperuser = true
    fakeUser.permissions = []

    expect(permUtils.getPermissions(fakeUser)).toEqual(permUtils.fmtKeysToPermissions(['salary', 'secLevel']))
  })

  it('Correctly identifies whether a user has a permission', () => {
    const perms: Array<keyof Employee> = ['salary']
    overwriteEnv(perms)

    const fakeUser = mock<User>()
    fakeUser.isSuperuser = false
    fakeUser.permissions = permUtils.fmtKeysToPermissions(perms)

    expect(permUtils.hasPermission(permUtils.convertKeyToPermission('salary'), fakeUser)).toBe(true)
  })
})
