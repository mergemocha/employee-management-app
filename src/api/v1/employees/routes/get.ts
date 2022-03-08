import { Employee, User } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { convertKeyToPermission, hasPermission, keyRequiresPermission } from '../../../../security/permissions'
import { getUserBySession } from '../../../../security/session'
import { ValueOf } from '../../../../types/utils'

type IndexableEmployee = Employee & { [key: string]: ValueOf<IndexableEmployee> }

export default async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const user = await getUserBySession(req.headers.authorization as string) as User

  const employees = await prisma.employee.findMany() as IndexableEmployee[]
  const result: Array<Partial<IndexableEmployee>> = []

  for (const employee of employees) {
    const resultemployee: Partial<IndexableEmployee> = {}

    for (const key in employee) {
      if (!keyRequiresPermission(key as keyof Employee) || hasPermission(convertKeyToPermission(key as keyof Employee), user)) {
        resultemployee[key] = employee[key]
      } else {
        continue
      }
    }
    result.push(resultemployee)
  }
  await res.send(result)
}
