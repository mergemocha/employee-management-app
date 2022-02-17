// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="types/globals.d.ts"/>

/* eslint-disable import/first */
import dotenv from 'dotenv-safe'
dotenv.config()

import pino from 'pino'
import Fastify from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import initPrisma from './utils/initPrisma'
import v1 from './api/v1'

// Configure Pino logger
global.logger = pino({
  level: process.env.LOG_LEVEL,
  transport: {
    target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : ''
  }
})

// Configure Prisma
const prisma = initPrisma()

// Configure Fastify
const fastify = Fastify({
  logger: {
    prettyPrint: process.env.NODE_ENV !== 'production'
  }
})

void (async () => {
  try {
    await prisma.$connect()
    logger.info('Prisma connection successful.')

    await fastify
      .register(cors)
      .register(helmet)
      .register(v1, { prefix: '/api/v1' })

    await fastify.listen(parseInt(process.env.PORT as string))
  } catch (err) {
    logger.error('Could not start application', err)
  } finally {
    await prisma.$disconnect()
  }
})()
