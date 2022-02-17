import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import available from './routes/available'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/available', available)
}
