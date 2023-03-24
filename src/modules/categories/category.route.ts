import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyReply } from "fastify";
import {
    createCategoryHandler,
    deleteCategoryHandler,
    getAllCategoriesHandler,
    getCategoryHandler,
    updateCategoryHandler
} from "../categories/category.controller";
import {
    CreateCategoryInput,
    UpdateCategoryInput,
    routeCreateCategorySchema,
    routeDeleteCategorySchema,
    routeGetAllCategoriesSchema,
    routeGetCategorySchema,
    routeUpdateCategorySchema
} from "./category.schema";
import { UuidParamsRequest } from "../shared/schemas";


const categoryRoute: FastifyPluginAsyncTypebox = async function(server: FastifyInstance) {

    server.get<{ Params: UuidParamsRequest, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeGetCategorySchema
        },
        getCategoryHandler
    )

    server.get<{ Reply: FastifyReply }>(
        "/",
        {
            schema: routeGetAllCategoriesSchema
        },
        getAllCategoriesHandler
    )

    server.post<{ Body: CreateCategoryInput, Reply: FastifyReply }>(
        "/",
        {
            schema: routeCreateCategorySchema
        },
        createCategoryHandler
    )

    server.patch<{  Params: UuidParamsRequest, Body: UpdateCategoryInput, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeUpdateCategorySchema
        },
        updateCategoryHandler
    )

    server.delete<{ Params: UuidParamsRequest, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeDeleteCategorySchema
        },
        deleteCategoryHandler
    )

}
export default categoryRoute;