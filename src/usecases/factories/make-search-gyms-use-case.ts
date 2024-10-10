import { SearchGymsUseCase } from "../search-gyms.usecase"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms.repository"

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}