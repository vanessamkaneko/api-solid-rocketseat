import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile.usecase'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
//sut - system under test

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
 })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John',
      email: 'john@test.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual('John')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => sut.execute({
      userId: 'non-existing-id'
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})