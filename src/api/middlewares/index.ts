import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import requireAuth from './requireAuth'
import requireSuperuser from './requireSuperuser'

const opts: { relation?: 'and' | 'or' } = { relation: 'and' }

export const requiresAuth = (fastify: FastifyInstance): RouteShorthandOptions => ({
  preHandler: fastify.auth([requireAuth], opts)
})

export const requiresSuperuser = (fastify: FastifyInstance): RouteShorthandOptions => ({
  preHandler: fastify.auth([requireSuperuser], opts)
})
