/* eslint-disable @typescript-eslint/no-misused-promises */

import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import employees from './employees'

import permissions from './permissions'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  await fastify
    // eslint-disable @typescript-eslint/no-misused-promises
    .register(permissions, { prefix: '/permissions' })
    .register(employees, { prefix: '/employees' })
}
