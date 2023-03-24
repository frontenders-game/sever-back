import { Static, Type } from "@sinclair/typebox";
import { responseMessage, uuidType } from "../../shared/schemas";
import { MultipartFile } from "@fastify/multipart";
import { routeSchema } from "../../../types";

export const productImageIdSchema = Type.Object(
    {
        id:  uuidType
    },
    {$id: "productImageIdSchema", additionalProperties: false}
)

export type ImageId = Static<typeof productImageIdSchema>


export const uploadProductImageSchema = Type.Strict(
    Type.Object(
        {
            file: Type.Unknown()
        },
        {additionalProperties: false}
    )
)

export interface UploadProductImage {
    file: MultipartFile
}

export const createProductImageSchema = Type.Object({
        productId:  uuidType,
        full: Type.Optional(Type.String()),
        small: Type.Optional(Type.String()),
        thumb: Type.Optional(Type.String()),
        order: Type.Integer({minimum: 1, maximum: 10, default: 1})
    },
    {$id: "createProductImageSchema", additionalProperties: false}
)

export type CreateProductImageInput = Static<typeof createProductImageSchema>

export const responseProductImageSchema = Type.Omit(Type.Intersect([
        productImageIdSchema,
        createProductImageSchema
    ]), ["productId"],
    {$id: "responseProductImageSchema", additionalProperties: false}
)

export type ResponseProductImage = Static<typeof responseProductImageSchema>


export const uuidProductIdParamsSchema = Type.Object({
    productId:  uuidType,
})
export type UuidProductIdParamsRequest = Static<typeof uuidProductIdParamsSchema>

export const uuidImageParams = Type.Object({
    productId:  uuidType,
    imageId:  uuidType
})
export type UuidImageParamsRequest = Static<typeof uuidImageParams>


export const routeGetProductImageSchema = routeSchema({
    tags: ['products/images'],
    params: uuidImageParams,
    response: {
        200: {
            message: responseMessage,
            data: responseProductImageSchema
        }
    },
})

//
// export const routeCreateProductImageSchema = routeSchema({
//     tags: ['products/images'],
//     body: createProductImageSchema,
//     response: {
//         201: {
//             message: responseMessage,
//             data: responseProductImageSchema
//         }
//     }
// })

export const routeDeleteProductImageSchema = routeSchema({
    tags: ['products/images'],
    params: uuidImageParams,
    response: {
        200: {
            message: responseMessage
        }
    }
})

export const routeUploadProductImageSchema = routeSchema({
    tags: ['products/images'],
    consumes: ['multipart/form-data'],
    params: uuidProductIdParamsSchema,
    body: uploadProductImageSchema,
    response: {
        200: {
            message: responseMessage,
            data: responseProductImageSchema
        }
    }
})