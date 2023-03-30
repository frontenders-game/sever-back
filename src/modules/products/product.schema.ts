import { Static, Type } from "@sinclair/typebox";
import {
    dateTimeType,
    nameType,
    responseMessage,
    slugType,
    uuidParamsType,
    uuidType,
    idSchema
} from "../shared/schemas";
import { createProductInformationSchema, responseProductInformationSchema } from "./information/information.schema";
import { responseProductReviewSchema } from "./review/review.schema";
import { responseProductImageSchema } from "./images/image.schema";
import { routeSchema } from "../../types";


const basicProduct = {
    name: nameType,
    isNew: Type.Boolean({default: false}),
    unitsOfMeasurement: Type.String({default: 'шт'}),
    step: Type.Number({default: 1}),
    priceRegular: Type.Number({minimum: 1}),
    priceWithCard: Type.Optional(Type.Number({minimum: 1})),
    discountPercent: Type.Any(),
    discountedPrice: Type.Any(),
    discountIsActive: Type.Boolean({default: false}),
    discountExpiresAt: Type.Optional(dateTimeType),
    ingredients: Type.Optional(Type.String()),
    stockCount: Type.Integer({default: 0}),
    categoryId: uuidType,
}

export const createProductSchema = Type.Object({
        ...basicProduct,
        subcategoryId: uuidType,
        information: Type.Optional(Type.Array(Type.Ref(createProductInformationSchema)))
    },
    {$id: "createProductSchema", additionalProperties: false}
)

export type CreateProductInput = Static<typeof createProductSchema>

export const updateProductSchema = Type.Intersect([createProductSchema, idSchema])
export type UpdateProductInput = Static<typeof updateProductSchema>

export const responseProductSchema = Type.Object({
            id: uuidType,
            ...basicProduct,
            slug: slugType,
            images: Type.Optional(Type.Array(Type.Ref(responseProductImageSchema))),
            categoryId: uuidType,
            averageRating: Type.Integer({default: 0, minimum: 0}),
            reviewsCount: Type.Integer({default: 0, minimum: 0}),
            reviews: Type.Optional(Type.Array(Type.Ref(responseProductReviewSchema))),
            information: Type.Optional(Type.Array(Type.Ref(responseProductInformationSchema)))
        },
    {$id: "responseProductSchema", additionalProperties: true}
)


export const routeGetProductSchema = routeSchema({
    tags: ['products'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage,
            data: responseProductSchema
        }
    },
})


export const routeCreateProductSchema = routeSchema({
    tags: ['products'],
    body: createProductSchema,
    response: {
        201: {
            message: responseMessage,
            data: responseProductSchema
        }
    }
})
export const routeUpdateProductSchema = routeSchema({
    tags: ['products'],
    params: uuidParamsType,
    body: updateProductSchema,
    response: {
        200: {
            message: responseMessage,
            data: responseProductSchema
        },
        304: {
            message: responseMessage
        }
    }
})
export const routeDeleteProductSchema = routeSchema({
    tags: ['products'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage
        }
    }
})

export {
    createProductInformationSchema,
    responseProductReviewSchema,
    responseProductImageSchema,
    responseProductInformationSchema
}