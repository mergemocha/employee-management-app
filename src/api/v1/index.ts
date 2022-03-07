/* eslint-disable @typescript-eslint/no-misused-promises */
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import permissions from './permissions'
import authorization from './authorization'
import register from './register'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  await fastify
    .register(permissions, { prefix: '/permissions' })
    .register(authorization, { prefix: '/auth' })
    .register(register, { prefix: '/register' })
}
