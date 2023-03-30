import cors from "@fastify/cors"
import { FastifyInstance } from "fastify";

export default function addCors(fastify: FastifyInstance) {
    fastify.register(cors, {
      // todo change later
        origin: '*'
    })
}