import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyReply } from "fastify";
import {
    createSubcategoryHandler,
    deleteSubcategoryHandler,
    getSubcategoryHandler,
    updateSubcategoryHandler
} from "../subcategories/subcategory.controller";

import { UuidParamsRequest } from "../shared/schemas";
import {     CreateSubcategoryInput,
    UpdateSubcategoryInput,
    routeCreateSubcategorySchema,
    routeDeleteSubcategorySchema,
    routeGetSubcategorySchema,
    routeUpdateSubcategorySchema } from "./subcategory.schema";


const subcategoryRoute: FastifyPluginAsyncTypebox = async function(server: FastifyInstance) {

    server.get<{ Params: UuidParamsRequest, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeGetSubcategorySchema
        },
        getSubcategoryHandler
    )

    server.post<{ Body: CreateSubcategoryInput, Reply: FastifyReply }>(
        "/",
        {
            schema: routeCreateSubcategorySchema
        },
        createSubcategoryHandler
    )

    server.patch<{  Params: UuidParamsRequest, Body: UpdateSubcategoryInput, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeUpdateSubcategorySchema
        },
        updateSubcategoryHandler
    )

    server.delete<{ Params: UuidParamsRequest, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeDeleteSubcategorySchema
        },
        deleteSubcategoryHandler
    )

}
export default subcategoryRoute;