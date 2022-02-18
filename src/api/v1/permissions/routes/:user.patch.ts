import { FastifyReply, FastifyRequest } from 'fastify'
import { Permission } from '../../../../security/permissions'

// TODO: Schema validation
export default async (req: FastifyRequest<{ Params: { user: string }, Body: { permissions: Permission[] } }>, res: FastifyReply): Promise<void> => {
  const user = await prisma.user.findFirst({ where: { id: req.params.user } })

  if (!user) {
    await res.status(404).send({ message: 'User not found' })
  } else if (!user.isSuperuser) {
    await res.status(403).send({ message: 'Forbidden' })
  } else {
    await prisma.user.update({
      where: {
        id: req.params.user
      },
      data: {
        ...user,
        permissions: req.body.permissions
      }
    })
  }
}
