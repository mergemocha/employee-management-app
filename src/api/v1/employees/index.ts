import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { requiresAuth, requiresSuperuser } from '../../middlewares'
import create from './routes/create'
import remove from './routes/delete'
import get from './routes/get'
import update from './routes/update'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/get', { ...requiresAuth(fastify), handler: get })
  fastify.post('/create', { ...requiresSuperuser(fastify), handler: create })
  fastify.post('/delete', { ...requiresSuperuser(fastify), handler: remove })
  fastify.post('/update', { ...requiresSuperuser(fastify), handler: update })
}
