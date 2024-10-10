import { ICheckInsRepository } from "@/repositories/ICheckIns.repository";

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

// nº checkins realizados pelo usuário
export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) { }

  async execute({ userId }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount
    }
  }
}