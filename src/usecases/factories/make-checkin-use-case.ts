import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms.repository"

import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-checkins.repository"
import { CheckInUseCase } from "../create-checkin.usecase"

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()

  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}