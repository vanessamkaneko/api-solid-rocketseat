import { UserAlreadyExistsError } from "@/usecases/errors/user-already-exists.error"
import { makeCreateGymUseCase } from "@/usecases/factories/make-create-gym-use-case"
import { makeRegisterUseCase } from "@/usecases/factories/make-register-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)
  
  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude
  })

  return reply.status(201).send()
}