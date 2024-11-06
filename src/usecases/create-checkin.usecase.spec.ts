import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import { CheckInUseCase } from './create-checkin.usecase'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error'
import { MaxDistanceError } from './errors/max-distance-error'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Bla bla Gym',
      description: null,
      phone: null,
      latitude: -23.3245219,
      longitude: -51.1689972
    })

    vi.useFakeTimers() // permite estabelecer datas específicas através do setSystemTime
  })

  afterEach(() => {
    vi.useRealTimers() // reseta o mock; retorna p/ as datas reais criadas pelo new Date
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.3245219,
      userLongitude: -51.1689972
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 9, 7, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.3245219,
      userLongitude: -51.1689972
    })

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.3245219,
        userLongitude: -51.1689972
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 9, 7, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.3245219,
      userLongitude: -51.1689972
    })

    vi.setSystemTime(new Date(2024, 9, 8, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.3245219,
      userLongitude: -51.1689972
    })

    expect(checkIn.id).toBeTruthy();
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Test Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.3245219),
      longitude: new Decimal(-51.1689972)
    })

    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -23.3055868,
      userLongitude: -51.1573124
    })).rejects.toBeInstanceOf(MaxDistanceError)

  })
})
