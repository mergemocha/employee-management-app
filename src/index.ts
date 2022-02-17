// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types/globals.d.ts"/>

/* eslint-disable import/first */
import dotenv from 'dotenv-safe'
dotenv.config()

import pino from 'pino'
import { PrismaClient } from '@prisma/client'

global.logger = pino({
  transport: {
    target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : ''
  }
})

const prisma = new PrismaClient()

void (async () => {
  try {
    await prisma.$connect()
    logger.info('Started')
  } catch (err) {
    logger.error('Could not start application', err)
  } finally {
    await prisma.$disconnect()
  }
})()
