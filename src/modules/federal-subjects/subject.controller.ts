import { getAllFederalSubjects } from "./subject.service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getAllFederalSubjectsHandler(request: FastifyRequest,  reply: FastifyReply) {
    const result = await getAllFederalSubjects();
    return reply.code(200).send({message: "Success", data: result});
}
