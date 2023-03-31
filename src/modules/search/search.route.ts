import { FastifyInstance, FastifyReply } from "fastify";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { routeSearchSchema, SearchQuery } from "./search.schema";
import { getSearchResultsHandler } from "./search.controller";

const searchRoute: FastifyPluginAsyncTypebox = async function (server: FastifyInstance) {

    server.get<{ Querystring: SearchQuery, Reply: FastifyReply }>(
        "/",
        {
            schema: routeSearchSchema
        },
        getSearchResultsHandler
    )

}
export default searchRoute;