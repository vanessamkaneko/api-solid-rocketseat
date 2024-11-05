import { InvalidCredentialsError } from "@/usecases/errors/invalid-credentials-error"
import { makeAuthenticateUseCase } from "@/usecases/factories/make-authenticate-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { email, password } = authenticateBodySchema.parse(request.body) 

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email, password
    })

    const token = await reply.jwtSign({}, { //criação do token
      sign: {
        sub: user.id
      }
    })

    return reply.status(200).send({
      token
    })

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

 
}