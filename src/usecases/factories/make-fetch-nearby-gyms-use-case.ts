import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms.usecase"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms.repository"

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}