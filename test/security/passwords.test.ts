import * as pwUtils from '../../src/security/passwords'

describe('Password hashing system', () => {
  it('Creates a random hash for the password every time', async () => {
    const pw = 'test'
    const hash1 = await pwUtils.hashPassword(pw)
    const hash2 = await pwUtils.hashPassword(pw)
    expect(hash1).not.toEqual(hash2)
  })

  it('Correctly validates a hashed password', async () => {
    const pw = 'test'
    const hash = await pwUtils.hashPassword(pw)
    expect(await pwUtils.checkPassword(pw, hash)).toBe(true)
  })
})
