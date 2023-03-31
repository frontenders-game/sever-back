import { Static, Type } from "@sinclair/typebox";
import {  uuidType } from "../../shared/schemas";


const basicReviewSchema = {
    name: Type.String(),
    rating: Type.Integer(),
    content: Type.Optional(Type.String())
}


export const createProductReviewSchema = Type.Object({
        ...basicReviewSchema,
        userId: Type.Optional( uuidType),
        productId:  uuidType,
    },
    {$id: "createProductReviewSchema", additionalProperties: false})

export type CreateProductReviewInput = Static<typeof createProductReviewSchema>

export const responseProductReviewSchema = Type.Object({
        ...basicReviewSchema,
        id:  uuidType,
        createdAt: Type.String(),
        user: Type.Object({
            firstName: Type.String(),
            lastName: Type.String()
        })
    },
    {$id: "responseProductReviewSchema", additionalProperties: false}
)

export type Review = Static<typeof responseProductReviewSchema>