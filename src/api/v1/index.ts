import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import permissions from './permissions'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  await fastify
    .register(permissions, { prefix: '/permissions' })
}
