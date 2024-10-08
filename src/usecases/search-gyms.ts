import { Gym } from "@prisma/client";
import { IGymsRepository } from "@/repositories/IGyms.repository";

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) { }

  async execute({ query, page }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {

    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms
    }
  }
}