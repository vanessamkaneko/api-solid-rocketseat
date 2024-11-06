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

    const token = await reply.jwtSign( //criação do token
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d'
        }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // todas as rotas terão acesso 
        secure: true, // cookie enctriptado pelo HTTPs ("HTTPs sendo usado no server?")
        sameSite: true, // cookie acessível apenas no mesmo site
        httpOnly: true // cookie só poderá ser acessado pelo backend; disponível apenas no contexto da requisição, sem ser salvo no browser
      })
      .status(200).send({
        token
      })

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }


}