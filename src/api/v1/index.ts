/* eslint-disable @typescript-eslint/no-misused-promises */
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import permissions from './permissions'
import login from './authorization'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  await fastify
    .register(permissions, { prefix: '/permissions' })
    .register(login, { prefix: '/login' })
}
