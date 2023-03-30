// import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
// import { FastifyInstance, FastifyReply } from "fastify";
//
// import {
//     CreateSubcategoryInput,
//     UpdateSubcategoryInput,
//     GetCategoryQuery,
//     routeCreateSubcategorySchema,
//     routeDeleteSubcategorySchema,
//     routeGetSubcategoryByIdSchema,
//     routeGetSubcategoryBySlugSchema,
//     routeUpdateSubcategorySchema
// } from "../categories/category.schema";
// import { SlugParams, UuidParams } from "../shared/schemas";
// import {
//     createCategoryHandler,
//     deleteCategoryHandler,
//     getCategoryHandler,
//     updateCategoryHandler
// } from "../categories/category.controller";
//
//
// const subcategoryRoute: FastifyPluginAsyncTypebox = async function(server: FastifyInstance) {
//     server.get<{ Querystring: GetCategoryQuery, Params: UuidParams, Reply: FastifyReply }>(
//         "/id/:id",
//         {
//             schema: routeGetSubcategoryByIdSchema
//         },
//         getCategoryHandler
//     )
//
//     server.get<{ Querystring: GetCategoryQuery, Params: SlugParams, Reply: FastifyReply }>(
//         "/slug/:slug",
//         {
//             schema: routeGetSubcategoryBySlugSchema
//         },
//         getCategoryHandler
//     )
//
//     server.post<{ Body: CreateSubcategoryInput, Reply: FastifyReply }>(
//         "/",
//         {
//             schema: routeCreateSubcategorySchema
//         },
//         createCategoryHandler
//     )
//
//     server.patch<{  Params: UuidParams, Body: UpdateSubcategoryInput, Reply: FastifyReply }>(
//         "/id/:id",
//         {
//             schema: routeUpdateSubcategorySchema
//         },
//         updateCategoryHandler
//     )
//
//     server.delete<{ Params: UuidParams, Reply: FastifyReply }>(
//         "/id/:id",
//         {
//             schema: routeDeleteSubcategorySchema
//         },
//         deleteCategoryHandler
//     )
//
// }
// export default subcategoryRoute;