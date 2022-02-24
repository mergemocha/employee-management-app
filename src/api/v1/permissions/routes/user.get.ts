import { FastifyReply, FastifyRequest } from 'fastify'
import { getAvailablePermissions } from '../../../../security/permissions'

export default async (req: FastifyRequest<{ Params: { user: string } }>, res: FastifyReply): Promise<void> => {
  const user = await prisma.user.findFirst({ where: { id: req.params.user } })

  if (!user) {
    await res.status(404).send({ message: 'User not found' })
  } else {
    await res.send({ permissions: user.isSuperuser ? getAvailablePermissions() : user.permissions })
  }
}
