import bcrypt from 'bcrypt'

/**
 * Converts a plaintext password into a bcrypt hash.
 *
 * @param password - Password to hash
 * @returns Hashed password
 */
export async function hashPassword (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS as string))
  return await bcrypt.hash(password, salt)
}

/**
 * Compares a plaintext password with a hashed password.
 *
 * @param input - Inputted password
 * @param actual - Hash of actual password
 * @returns Whether the two match
 */
export async function checkPassword (input: string, actual: string): Promise<boolean> {
  return await bcrypt.compare(input, actual)
}
