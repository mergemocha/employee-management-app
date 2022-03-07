import { FastifyReply, FastifyRequest } from 'fastify'
import { validateSession } from '../../security/session'

export default async (req: FastifyRequest, res: FastifyReply, done: (err?: any) => void): Promise<void> => {
  if (!req.headers.authorization) {
    done(new Error('Authorization header not present'))
  } else {
    if (!(await validateSession(req.headers.authorization)).isValid) {
      done(new Error('Unauthorized'))
    }
  }
}
