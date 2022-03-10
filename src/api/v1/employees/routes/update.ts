import 'reflect-metadata'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as jf from 'joiful'
import { Employee } from '@prisma/client'

class Validator {
  @jf.string() firstName: string
  @jf.string() lastName: string
  @jf.string() title: string
  @jf.string() department: string
  @jf.number() salary: number
  @jf.number() secLevel: number
  @jf.boolean() permanent: boolean
  @jf.array() projects: string[]
}

export default async (req: FastifyRequest<{Params: { id: string }, Body: Partial<Omit<Employee, 'id'>>}>, res: FastifyReply): Promise<void> => {
  const query = { where: { id: req.params.id } }
  const employee = await prisma.employee.findFirst(query)

  if (!employee) {
    await res.status(404).send({ message: 'Employee not found' })
  } else {
    const { error } = jf.validateAsClass(req.body ?? {}, Validator)

    if (error) {
      await res.status(400).send({ message: 'Validation error ', error })
    } else {
      await prisma.employee.update({
        ...query,
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          title: req.body.lastName,
          department: req.body.department,
          salary: req.body.salary,
          secLevel: req.body.secLevel,
          permanent: req.body.permanent,
          projects: req.body.projects
        }
      })

      await res.status(200).send({ message: 'OK' })
    }
  }
}
