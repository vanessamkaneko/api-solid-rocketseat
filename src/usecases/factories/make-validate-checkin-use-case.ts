import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-checkins.repository"
import { ValidateCheckInUseCase } from "../validate-checkin.usecase"

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}