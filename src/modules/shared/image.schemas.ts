import { Type } from "@sinclair/typebox";
import { idSchema, responseMessage,  uuidParamsType, uuidType } from "./schemas";
import { routeSchema } from "../../types";
import { MultipartFile } from "@fastify/multipart";

export interface IImage {
    file: MultipartFile
}

export const uploadImageSchema = Type.Strict(
    Type.Object(
        {
            file: Type.Unknown()
        },
        {additionalProperties: false}
    )
)

export const entityIdSchema = Type.Union(
    [
        Type.Object({categoryId: uuidType}),
        Type.Object({articleId: uuidType})
    ])

export const responseImageSchema = Type.Intersect([
        idSchema,
        Type.Object({
                categoryId: Type.Optional(uuidType),
                articleId: Type.Optional(uuidType),
                url:  Type.String({format: "uri"}),
            }
        )
    ],
    {$id: "responseImageSchema", additionalProperties: false}
)

export const routeGetProductImageSchema = routeSchema({
    tags: ['images'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage,
            data: responseImageSchema
        }
    },
})

export const routeDeleteProductImageSchema = routeSchema({
    tags: ['images'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage
        }
    }
})

export const routeUploadProductImageSchema = routeSchema({
    tags: ['images'],
    consumes: ['multipart/form-data'],
    querystring: entityIdSchema,
    body: uploadImageSchema,
    response: {
        200: {
            message: responseMessage,
            data: responseMessage
        }
    }
})
