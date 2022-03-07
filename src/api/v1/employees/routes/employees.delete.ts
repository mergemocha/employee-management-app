import { FastifyReply, FastifyRequest } from 'fastify'

export default async (req: FastifyRequest<{Body: { id: string } }>, res: FastifyReply): Promise<void> => {
  if (!req.body.id) {
    await res.status(400).send({ message: 'Field cannot be empty' })
  } else {
    await prisma.employee.delete({
      where: {
        id: req.body.id
      }
    })
    await res.status(200).send({ message: 'ok' })
  }
}
