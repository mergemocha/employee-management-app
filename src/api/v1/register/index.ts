import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import addUser from './routes/add-user'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.post('/add-user', addUser)
}
