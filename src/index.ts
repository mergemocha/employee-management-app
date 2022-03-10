/* eslint-disable import/first, @typescript-eslint/triple-slash-reference, @typescript-eslint/no-misused-promises */
/// <reference path="types/globals.d.ts"/>
/// <reference path="../node_modules/fastify-auth/auth.d.ts"/>

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

// Configure Prisma
import * as prismaUtils from './utils/prisma'
global.prisma = prismaUtils.init()

import Fastify from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import auth from 'fastify-auth'
import v1 from './api/v1'

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

    await prismaUtils.checkAndCreateSuperuser()
    await prismaUtils.checkAndCreateEmployees()

    await fastify
      .register(cors)
      .register(helmet)
      .register(auth)
      .register(v1, { prefix: '/api/v1', prisma })

    await fastify.listen(parseInt(process.env.PORT as string))
  } catch (err) {
    logger.error(`Could not start application: ${(err as Error).stack}`)
  } finally {
    await prisma.$disconnect()
  }
})()

// Needed for dev, ts-node-dev hangs sometimes otherwise
process.on('SIGTERM', () => process.exit())
