import { Type } from "@sinclair/typebox";
import { idSchema, responseMessage, uploadImageSchema, uuidParamsType, uuidType } from "../shared/schemas";
import { routeSchema } from "../../types";


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
