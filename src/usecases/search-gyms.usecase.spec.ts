import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms.usecase'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Aeiou Gym',
      description: null,
      phone: null,
      latitude: -23.3245219,
      longitude: -51.1689972
    })

    await gymsRepository.create({
      title: 'Bcde Gym',
      description: null,
      phone: null,
      latitude: -23.3245219,
      longitude: -51.1689972
    })

    const { gyms } = await sut.execute({
      query: 'Bcde',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Bcde Gym' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Bcde Gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.3245219,
        longitude: -51.1689972
      })
    }

    const { gyms } = await sut.execute({
      query: 'Bcde',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Bcde Gym 21' }),
      expect.objectContaining({ title: 'Bcde Gym 22' })
    ])
  })
})
