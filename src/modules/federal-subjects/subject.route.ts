import { FastifyInstance, FastifyReply } from "fastify";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { getAllFederalSubjectsHandler } from "./subject.controller";
import { routeGetFederalSubjectsSchema } from "./subject.schema";

const federalSubjectRoute: FastifyPluginAsyncTypebox = async function (server: FastifyInstance) {

    server.get<{ Reply: FastifyReply }>(
        "/",
        {
            schema: routeGetFederalSubjectsSchema
        },
        getAllFederalSubjectsHandler
    )

}
export default federalSubjectRoute;