import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/ICheckIns.repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-checkin-validation-error";

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

// checkin deve ser feito dentro de 20 min
export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) { }

  async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    // verificando diferença do momento atual c/ o momento do checkin
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    )

    if(distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validate_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn
    }
  }
}