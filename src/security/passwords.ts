import bcrypt from 'bcrypt'

export async function hashPassword (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS as string))
  return await bcrypt.hash(password, salt)
}

export async function checkPassword (input: string, actual: string): Promise<boolean> {
  return await bcrypt.compare(input, actual)
}
