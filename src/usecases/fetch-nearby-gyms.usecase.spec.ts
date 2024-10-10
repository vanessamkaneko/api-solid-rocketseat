import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms.usecase'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.usecase'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.3245219,
      longitude: -51.1689972
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.3224151,
      longitude: -51.373718
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.3245219,
      userLongitude: -51.1689972
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})
