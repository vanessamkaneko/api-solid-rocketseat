import { CheckIn, Prisma } from "@prisma/client";
import { ICheckInsRepository } from "../ICheckIns.repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id
      }
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({ // findFirst => p/ buscar por campos que não sejam únicos
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(), // greater than or equal
          lte: endOfTheDay.toDate() // lower than or equal
        }
      }
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number){
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId
      },
      take: 20, // qtos itens quero trazer? 20 pois são 20 por pág.
      skip: (page - 1) * 20
    })

    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })

    return count
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data
    })

    return checkIn
  }
}