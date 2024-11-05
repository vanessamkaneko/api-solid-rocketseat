import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify() 
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized'})
  }
  
}

/* When you call request.jwtVerify(), it verifies the JWT and, if successful (if it is valid), adds the decoded payload to request.user 
(or a similar property, depending on your configuration). */