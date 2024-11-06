
import { makeCheckInUseCase } from "@/usecases/factories/make-checkin-use-case"
import { makeCreateGymUseCase } from "@/usecases/factories/make-create-gym-use-case"
import { makeValidateCheckInUseCase } from "@/usecases/factories/make-validate-checkin-use-case"

import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)
  
  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute({
    checkInId
  })

  return reply.status(204).send()
}