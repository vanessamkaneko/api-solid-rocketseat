import { makeFetchUserCheckInsHistoryUseCase } from "@/usecases/factories/make-fetch-user-checkins-history-use-case"
import { makeSearchGymsUseCase } from "@/usecases/factories/make-search-gyms-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page
  })

  return reply.status(200).send({
    checkIns
  })
}

