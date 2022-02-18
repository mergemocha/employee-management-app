import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import available from './routes/available'
import userGet from './routes/:user.get'
import userPatch from './routes/:user.patch'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/available', available)
  fastify.get('/:user', userGet)
  fastify.patch('/:user', userPatch)
}
