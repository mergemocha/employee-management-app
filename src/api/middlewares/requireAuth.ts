import { FastifyReply, FastifyRequest } from 'fastify'
import { validateSession } from '../../security/session'

export default async (req: FastifyRequest, res: FastifyReply, done: (err?: any) => void): Promise<void> => {
  const hasHeader = !!req.headers.authorization

  if (!hasHeader) {
    done(new Error('Authorization header not present'))
  } else if (!(await validateSession(req.headers.authorization as string)).isValid) {
    done(new Error('Unauthorized'))
  }
}
