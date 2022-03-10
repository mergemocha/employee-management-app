import { FastifyReply, FastifyRequest } from 'fastify'

export default async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply): Promise<void> => {
  const query = { where: { id: req.params.id } }
  const employee = await prisma.employee.findFirst(query)

  if (!employee) {
    await res.status(404).send({ message: 'Employee not found' })
  } else {
    await prisma.employee.delete(query)
    await res.status(200).send({ message: 'OK' })
  }
}
