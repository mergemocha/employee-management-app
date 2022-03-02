/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'
import pino from 'pino'

declare global {
  var logger: pino.Logger<pino.LoggerOptions>
  var prisma: PrismaClient
}
