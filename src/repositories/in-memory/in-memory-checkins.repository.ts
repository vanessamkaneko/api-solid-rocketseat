import { Prisma, CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "../ICheckIns.repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.items.find(item => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date') // retorna início do dia: ex - 2024-10-08T00:00:00
    const endOfTheDay = dayjs(date).endOf('date') // retorna fim do dia: 2024-10-08T23:59:59

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate = checkInDate.isBetween(startOfTheDay, endOfTheDay, null, '[]')

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items.filter(item => item.user_id === userId).slice((page - 1) * 20, page * 20)
    // page 1 -> 0 - 20 | page 2 -> 20 - 40 | page 3 -> 40 - 60...
  }

  async countByUserId(userId: string) {
    return this.items.filter(item => item.user_id === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validate_at: data.validate_at ? new Date(data.validate_at) : null,
      created_at: new Date()
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(item => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}