import { FastifyReply, FastifyRequest } from 'fastify'
import { isSuperuser } from '../../security/permissions'
import { getUserBySession, validateSession } from '../../security/session'

export default async (req: FastifyRequest, res: FastifyReply, done: (err?: any) => void): Promise<void> => {
  const { authorization } = req.headers

  if (!authorization) {
    done(new Error('Authorization header not present'))
  } else {
    if (!(await validateSession(authorization)).isValid) {
      done(new Error('Unauthorized'))
    } else {
      const user = await getUserBySession(authorization)

      if (!user) {
        done(new Error('Unauthorized'))
      } else if (!isSuperuser(user)) {
        done(new Error('Superuser permissions required'))
      }
    }
  }
}
