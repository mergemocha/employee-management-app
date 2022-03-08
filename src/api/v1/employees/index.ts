import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { requiresAuth, requiresSuperuser } from '../../middlewares'
import employeesCreate from './routes/employees.create'
import employeesDelete from './routes/employees.delete'
import employeesGet from './routes/employees.get'
import employeesUpdate from './routes/employees.update'

export default async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
  fastify.get('/get', { ...requiresAuth(fastify), handler: employeesGet })
  fastify.post('/create', { ...requiresSuperuser(fastify), handler: employeesCreate })
  fastify.post('/delete', { ...requiresSuperuser(fastify), handler: employeesDelete })
  fastify.post('/update', { ...requiresSuperuser(fastify), handler: employeesUpdate })
}
