import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { requiresAuth, requiresSuperuser } from '../../middlewares'
import create from './routes/create'
import remove from './routes/delete'
import get from './routes/get'
import update from './routes/update'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/', { ...requiresAuth(fastify), handler: get })
  fastify.post('/', { ...requiresSuperuser(fastify), handler: create })
  fastify.delete('/:id', { ...requiresSuperuser(fastify), handler: remove })
  fastify.patch('/:id', { ...requiresSuperuser(fastify), handler: update })
}
