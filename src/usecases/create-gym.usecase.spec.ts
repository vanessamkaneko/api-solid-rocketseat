import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { CreateGymUseCase } from './create-gym.usecase'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Bla bla Gym',
      description: null,
      phone: null,
      latitude: -23.3245219,
      longitude: -51.1689972
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})