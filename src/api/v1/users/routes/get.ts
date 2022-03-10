import { FastifyReply, FastifyRequest } from 'fastify'
import { getPermissions } from '../../../../security/permissions'

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const users = await prisma.user.findMany()

  await res.send(
    users
      .filter(user => !user.isSuperuser)
      .map(user => ({
        id: user.id,
        username: user.username,
        permissions: getPermissions(user)
      }))
  )
}
