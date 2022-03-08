/* eslint-disable @typescript-eslint/no-misused-promises */
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import employees from './employees'

import permissions from './permissions'
import auth from './auth'
import register from './register'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  await fastify
    .register(permissions, { prefix: '/permissions' })
    .register(auth, { prefix: '/auth' })
    .register(register, { prefix: '/register' })
    .register(employees, { prefix: '/employees' })
}
