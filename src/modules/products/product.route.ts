import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyReply } from "fastify";
import {
    createProductHandler,
    deleteProductHandler,
    getProductHandler,
    updateProductHandler
} from "./product.controller";
import {
    CreateProductInput,
    routeCreateProductSchema,
    routeDeleteProductSchema,
    routeGetProductByIdSchema,
    routeGetProductBySlugSchema,
    routeUpdateProductSchema,
    UpdateProductInput
} from "./product.schema";
import { SlugParams, UuidParams } from "../shared/schemas";
import { IImage } from "../shared/image.schemas";
import {
    routeDeleteProductImageSchema,
    routeGetProductImageSchema,
    routeUploadProductImageSchema,
    UuidImageParamsRequest,
    UuidProductIdParamsRequest
} from "./images/image.schema";
import {
    deleteProductImageHandler,
    getProductImageHandler,
    uploadProductImageHandler
} from "./images/image.controller";


const productRoute: FastifyPluginAsyncTypebox = async function (server: FastifyInstance) {

    // Products
    server.get<{ Params: UuidParams, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeGetProductByIdSchema
        },
        getProductHandler
    )

    server.get<{  Params: SlugParams, Reply: FastifyReply }>(
        "/slug/:slug",
        {
            schema: routeGetProductBySlugSchema
        },
        getProductHandler
    )


    server.post<{ Body: CreateProductInput, Reply: FastifyReply }>(
        "/",
        {
            schema: routeCreateProductSchema
        },
        createProductHandler
    )

    server.patch<{ Params: UuidParams, Body: UpdateProductInput, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeUpdateProductSchema
        },
        updateProductHandler
    )

    server.delete<{ Params: UuidParams, Reply: FastifyReply }>(
        "/id/:id",
        {
            schema: routeDeleteProductSchema
        },
        deleteProductHandler
    )

    // Images
    server.get<{ Params: UuidImageParamsRequest, Reply: FastifyReply }>(
        "/:productId/images/id/:imageId",
        {
            schema: routeGetProductImageSchema
        },
        getProductImageHandler
    )


    server.post<{ Params: UuidProductIdParamsRequest, Body: IImage, Reply: FastifyReply }>(
        "/:productId/images/upload",
        {
            schema: routeUploadProductImageSchema
        },
        uploadProductImageHandler
    )

    server.delete<{ Params: UuidImageParamsRequest, Reply: FastifyReply }>(
        "/:productId/images/id/:imageId",
        {
            schema: routeDeleteProductImageSchema
        },
        deleteProductImageHandler
    )


}
export default productRoute;