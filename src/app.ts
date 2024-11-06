import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";

import { ZodError } from "zod"; // validation errors
import { env } from "./env";
import { userRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '10m', // a cada 10 min será checado se o user possui o refresh_token p/ criar um novo JWT p/ ele, se necessário
  }
})

app.register(fastifyCookie)

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error!', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {

  }

  return reply.status(500).send({ message: 'Internal server error!' })
})
