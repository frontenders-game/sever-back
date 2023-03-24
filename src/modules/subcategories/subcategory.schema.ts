import { basicCategory, responseMessage, slugType, uuidParamsType,  uuidType } from "../shared/schemas"
import { Static, Type } from "@sinclair/typebox";
import { responseProductSchema } from "../products/product.schema";
import { routeSchema } from "../../types";

export const subcategoryIdSchema = Type.Object(
    {
        id:  uuidType
    },
    {$id: "subcategoryIdSchema", additionalProperties: false}
)

export type subcategoryId = Static<typeof subcategoryIdSchema>

export const createSubcategorySchema = Type.Object(
    {
        ...basicCategory,
        categoryId:  uuidType
    },
    {$id: "createSubcategorySchema", additionalProperties: false}
)

export type CreateSubcategoryInput = Static<typeof createSubcategorySchema>

export const updateSubcategorySchema = Type.Intersect([createSubcategorySchema, subcategoryIdSchema])
export type UpdateSubcategoryInput = Static<typeof updateSubcategorySchema>


export const responseSubcategorySchema = Type.Object(
    {
        id:  uuidType,
        ...basicCategory,
        slug: slugType,
        categoryId:  uuidType,
        image: Type.String(),
        productsCount: Type.Integer({default: 0, minimum: 0}),
        products: Type.Optional(Type.Array(Type.Ref(responseProductSchema)))
    },
    {$id: "responseSubcategorySchema", additionalProperties: false}
)
export type SubResponseCategory = Static<typeof responseSubcategorySchema>


export const routeGetSubcategorySchema = routeSchema({
    tags: ['subcategories'],
    params:  uuidParamsType,
    response: {
        200: {
            message: responseMessage,
            data: responseSubcategorySchema
        }
    },
})

export const routeCreateSubcategorySchema = routeSchema({
    tags: ['subcategories'],
    body: createSubcategorySchema,
    response: {
        201: {
            message: responseMessage,
            data: responseSubcategorySchema
        }
    }
})

export const routeUpdateSubcategorySchema = routeSchema({
    tags: ['subcategories'],
    params:  uuidParamsType,
    body: updateSubcategorySchema,
    response: {
        200: {
            message: responseMessage,
            data: responseSubcategorySchema
        },
        304: {
            message: responseMessage
        }
    }
})
export const routeDeleteSubcategorySchema = routeSchema({
    tags: ['subcategories'],
    params:  uuidParamsType,
    response: {
        200: {
            message: responseMessage
        }
    }
})