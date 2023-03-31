import { FastifyReply, FastifyRequest } from "fastify";
import { SearchQuery } from "./search.schema";
import { searchCategoriesService, searchProductsService, searchSubcategoriesService } from "./search.service";

export async function getSearchResultsHandler(
    request: FastifyRequest<{ Querystring: SearchQuery, Reply: FastifyReply }>,
    reply: FastifyReply
) {
    const text = request.query.searchText

    reply.code(200).send(
        {
            message: "Success",
            data: {
                categories: await searchCategoriesService(text),
                subcategories: await searchSubcategoriesService(text),
                products: await searchProductsService(text)
            }
        })
}