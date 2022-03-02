import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import permissions from './permissions'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  await fastify
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .register(permissions, { prefix: '/permissions' })
}
