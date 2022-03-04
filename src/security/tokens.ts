import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export function signToken (user: User): string {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)
}

export function checkUserToken (token: string, user: User): boolean {
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string } & jwt.JwtPayload
    if (id === user.id) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}
