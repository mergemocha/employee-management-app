import { FastifyReply, FastifyRequest } from 'fastify'

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const employee = await prisma.employee.findMany()
  await res.send(employee)
}
