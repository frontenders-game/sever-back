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
    UpdateProductInput,
    routeCreateProductSchema,
    routeDeleteProductSchema,
    routeGetProductSchema,
    routeUpdateProductSchema
} from "./product.schema";
import { UuidParamsRequest } from "../shared/schemas";
import {
    routeDeleteProductImageSchema,
    routeGetProductImageSchema,
    routeUploadProductImageSchema,
    UploadProductImage,
    UuidImageParamsRequest, UuidProductIdParamsRequest
} from "./images/image.schema";
import {
    deleteProductImageHandler,
    getProductImageHandler,
     uploadProductImageHandler
} from "./images/image.controller";



const productRoute: FastifyPluginAsyncTypebox = async function(server: FastifyInstance) {

    // Products
    server.get<{ Params: UuidParamsRequest, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeGetProductSchema
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

    server.patch<{  Params: UuidParamsRequest, Body: UpdateProductInput, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeUpdateProductSchema
        },
        updateProductHandler
    )

    server.delete<{ Params: UuidParamsRequest, Reply: FastifyReply }>(
        "/:id",
        {
            schema: routeDeleteProductSchema
        },
        deleteProductHandler
    )

    // Images
    server.get<{ Params: UuidImageParamsRequest, Reply: FastifyReply }>(
        "/:productId/images/:imageId",
        {
            schema: routeGetProductImageSchema
        },
        getProductImageHandler
    )


    server.post<{ Params: UuidProductIdParamsRequest, Body: UploadProductImage, Reply: FastifyReply }>(
        "/:productId/images/upload",
        {
            schema: routeUploadProductImageSchema
        },
        uploadProductImageHandler
    )

    server.delete<{ Params: UuidImageParamsRequest, Reply: FastifyReply }>(
        "/:productId/images/:imageId",
        {
            schema: routeDeleteProductImageSchema
        },
        deleteProductImageHandler
    )


}
export default productRoute;