import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-checkins-history.usecase"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-checkins.repository"

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}