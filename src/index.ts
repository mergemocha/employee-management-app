/* eslint-disable import/first, @typescript-eslint/triple-slash-reference */
/// <reference path="types/globals.d.ts"/>

// Load env
import dotenv from 'dotenv-safe'
dotenv.config()

// Configure logger
import pino from 'pino'
global.logger = pino({
  level: process.env.LOG_LEVEL,
  transport: {
    target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : ''
  }
})

import Fastify from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import middie from 'middie'
import * as prismaUtils from './utils/prisma'
import v1 from './api/v1'

// Configure Prisma
const prisma = prismaUtils.init()

// Configure Fastify
const fastify = Fastify({
  logger: {
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
})

void (async () => {
  logger.info('Starting...')

  try {
    await prisma.$connect()
    logger.info('Prisma connection successful.')

    await prismaUtils.checkAndCreateSuperuser(prisma)

    await fastify
      .register(cors)
      .register(helmet)
      .register(middie)
      .register(v1, { prefix: '/api/v1', prisma })

    await fastify.listen(parseInt(process.env.PORT as string))
  } catch (err) {
    logger.error(`Could not start application: ${err}`)
  } finally {
    await prisma.$disconnect()
  }
})()

// Needed for dev, ts-node-dev hangs sometimes otherwise
process.on('SIGTERM', () => process.exit())
