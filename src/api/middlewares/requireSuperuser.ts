import { FastifyReply, FastifyRequest } from 'fastify'
import { isSuperuser } from '../../security/permissions'

export default async (req: FastifyRequest, res: FastifyReply, done: (err?: any) => void): Promise<void> => {
  if (!req.headers.authorization) {
    done(new Error('Authorization header not present'))
  } else {
    // TODO: Validate user based on token
    const user = await prisma.user.findFirst({ where: { id: req.headers.authorization } }) // FIXME: This is just to test that it works

    if (!user) {
      done(new Error('Unauthorized'))
    } else if (!isSuperuser(user)) {
      done(new Error('Superuser permissions required'))
    }
  }
}
