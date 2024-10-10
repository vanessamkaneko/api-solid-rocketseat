import { CreateGymUseCase } from "../create-gym.usecase"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms.repository"

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}