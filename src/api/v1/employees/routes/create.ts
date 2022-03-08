import 'reflect-metadata'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as jf from 'joiful'

interface Body {
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
  @jf.string().required() firstName: string
  @jf.string().required() lastName: string
  @jf.string().required() title: string
  @jf.string().required() department: string
  @jf.number().required() salary: number
  @jf.number().required() secLevel: number
  @jf.boolean().required() permanent: boolean
  @jf.array().required() projects: string[]
}

export default async (req: FastifyRequest<{Body: Body}>, res: FastifyReply): Promise<void> => {
  const { error } = jf.validateAsClass(req.body, Validator)
  if (error) {
    await res.status(400).send({ message: 'Validation error', error })
  } else {
    await prisma.employee.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        title: req.body.title,
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
