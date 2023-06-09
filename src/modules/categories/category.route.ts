import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyReply } from "fastify";
import { SlugParams, UuidParams } from "../shared/schemas";
import {
    CreateCategoryInput,
    CreateSubcategoryInput,
    FilterCategoryProductsQuery,
    routeCreateCategorySchema,
    routeCreateSubcategorySchema,
    routeDeleteCategorySchema,
    routeGetAllCategoriesSchema,
    routeGetCategoryByIdSchema,
    routeGetCategoryBySlugSchema,
    routeUpdateCategorySchema,
    UpdateCategoryInput
} from "./category.schema";
import {
    createCategoryHandler,
    deleteCategoryHandler,
    getAllCategoriesHandler,
    getCategoryHandler,
    updateCategoryHandler
} from "./category.controller";


const categoryRoute: FastifyPluginAsyncTypebox = async function (server: FastifyInstance) {

    server.get<{ Reply: FastifyReply }>(
        "/",
        {
            schema: routeGetAllCategoriesSchema
        },
        getAllCategoriesHandler
    )

    server.get<{ Querystring: FilterCategoryProductsQuery, Params: UuidParams, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeGetCategoryByIdSchema
        },
        getCategoryHandler
    )

    server.get<{ Querystring: FilterCategoryProductsQuery, Params: SlugParams, Reply: FastifyReply }>(
        "/slug/:slug",
        {
            schema: routeGetCategoryBySlugSchema
        },
        getCategoryHandler
    )

    server.post<{ Body: CreateCategoryInput, Reply: FastifyReply }>(
        "/",
        {
            schema: routeCreateCategorySchema
        },
        createCategoryHandler
    )

    server.post<{ Body: CreateSubcategoryInput, Reply: FastifyReply }>(
        "/subcategory",
        {
            schema: routeCreateSubcategorySchema
        },
        createCategoryHandler
    )

    server.patch<{ Params: UuidParams, Body: UpdateCategoryInput, Reply: FastifyReply }>(
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