import { FastifyReply, FastifyRequest } from 'fastify'
import { validateSession } from '../../security/session'

export default async (req: FastifyRequest, res: FastifyReply, done: (err?: any) => void): Promise<void> => {
  const { authorization } = req.headers
  const hasHeader = !!authorization

  if (!hasHeader) {
    done(new Error('Authorization header not present'))
  } else if (!(await validateSession(authorization)).isValid) {
    done(new Error('Unauthorized'))
  }
}
