import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { requiresSuperuser } from '../../middlewares'

import get from './routes/get'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/', requiresSuperuser(fastify), get)
}
