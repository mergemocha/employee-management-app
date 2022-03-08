import { Employee, User } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { convertKeyToPermission, hasPermission } from '../../../../security/permissions'
import { getUserBySession } from '../../../../security/session'
import { ValueOf } from '../../../../types/utils'

type IndexableEmployee = Employee & { [key: string]: ValueOf<IndexableEmployee> }

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const user = await getUserBySession(req.headers.authorization as string) as User

  const employees = await prisma.employee.findMany() as IndexableEmployee[]

  for (const employee of employees) {
    const resultemployee: Partial<IndexableEmployee> = {}

    for (const key in employee) {
      if (hasPermission(convertKeyToPermission(key as keyof Employee), user)) {
        continue
      } else {
        resultemployee[key] = employee[key]
      }
    }
  }

  await res.send(result)
}
