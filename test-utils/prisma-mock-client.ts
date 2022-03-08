import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import prismaClient from './prisma-client'

// FIXME: Cannot create Prisma tests currently because the mocking engine is broken since Nov 2021
// https://github.com/prisma/prisma/issues/10203

jest.mock('./prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prisma)
})

export const prisma = prismaClient as unknown as DeepMockProxy<PrismaClient>
