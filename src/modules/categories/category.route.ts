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
    GetCategoryQuery,
    routeCreateCategorySchema,
    routeDeleteCategorySchema,
    routeGetAllCategoriesSchema,
    routeGetCategoryByIdSchema,
    routeGetCategoryBySlugSchema,
    routeUpdateCategorySchema
} from "./category.schema";
import { SlugParams, UuidParams } from "../shared/schemas";


const categoryRoute: FastifyPluginAsyncTypebox = async function(server: FastifyInstance) {
    server.get<{ Querystring: GetCategoryQuery, Params: UuidParams, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeGetCategoryByIdSchema
        },
        getCategoryHandler
    )

    server.get<{ Querystring: GetCategoryQuery, Params: SlugParams, Reply: FastifyReply }>(
        "/slug/:slug",
        {
            schema: routeGetCategoryBySlugSchema
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

    server.patch<{  Params: UuidParams, Body: UpdateCategoryInput, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeUpdateCategorySchema
        },
        updateCategoryHandler
    )

    server.delete<{ Params: UuidParams, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeDeleteCategorySchema
        },
        deleteCategoryHandler
    )

}
export default categoryRoute;