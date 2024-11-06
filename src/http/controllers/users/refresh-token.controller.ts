import { FastifyRequest, FastifyReply } from "fastify"

export async function refresh(request: FastifyRequest, reply: FastifyReply) {

  await request.jwtVerify({ onlyCookie: true }) // verifica se nos cookies da requisição existe o refreshToken (que ainda é válido)

  const { role } = request.user

  const token = await reply.jwtSign({ role }, { //criação do token
    sign: {
      sub: request.user.sub
    }
  })

  const refreshToken = await reply.jwtSign({ role }, {
    sign: {
      sub: request.user.sub,
      expiresIn: '7d'
    }
  })

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
}