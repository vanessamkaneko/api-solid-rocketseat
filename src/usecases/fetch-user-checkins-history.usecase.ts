import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/ICheckIns.repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

// histórico de checkins do user
export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) { }

  async execute({ userId, page }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return {
      checkIns
    }
  }
}