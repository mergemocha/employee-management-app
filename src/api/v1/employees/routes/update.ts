import 'reflect-metadata'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as jf from 'joiful'

interface Body {
  id: string
  firstName: string
  lastName: string
  title: string
  department: string
  salary: number
  secLevel: number
  permanent: boolean
  projects: string[]
}

class Validator {
  @jf.string().required() id: string
  @jf.string() firstName: string
  @jf.string() lastName: string
  @jf.string() title: string
  @jf.string() department: string
  @jf.number() salary: number
  @jf.number() secLevel: number
  @jf.boolean() permanent: boolean
  @jf.array() projects: string[]
}

export default async (req: FastifyRequest<{Body: Body}>, res: FastifyReply): Promise<void> => {
  const { error } = jf.validateAsClass(req.body, Validator)
  if (error) {
    await res.status(400).send({ message: 'Validation error ', error })
  } else {
    await prisma.employee.update({
      where: {
        id: req.body.id
      },
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
