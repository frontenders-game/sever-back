import { Static, Type } from "@sinclair/typebox"
import { basicCategory, nameType, responseMessage, slugType, uuidParamsType, uuidType } from "../shared/schemas";
import { responseSubcategorySchema } from "../subcategories/subcategory.schema";
import { responseProductSchema } from "../products/product.schema";
import { routeSchema } from "../../types";


export const categoryIdSchema = Type.Object(
    {
        id: uuidType
    },
    {$id: "categoryIdSchema", additionalProperties: false}
)

export type CategoryId = Static<typeof categoryIdSchema>

export const createCategorySchema = Type.Object(
    {
        ...basicCategory,
    },
    {$id: "createCategorySchema", additionalProperties: false}
)

export type CreateCategoryInput = Static<typeof createCategorySchema>

export const updateCategorySchema = Type.Intersect([createCategorySchema, categoryIdSchema])
export type UpdateCategoryInput = Static<typeof updateCategorySchema>

const responseFilter =
    Type.Object({
        minimumPrice: Type.Integer({minimum: 0, default: 0}),
        maximumPrice: Type.Integer({minimum: 0, default: 0}),
        subcategories: Type.Array(Type.Object({
            name: nameType,
            id: uuidType,
            productsCount: Type.Integer()
        }))
    })

export const responseCategorySchema = Type.Object(
    {
        id: uuidType,
        filter: Type.Optional(responseFilter),
        ...basicCategory,
        slug: slugType,
        image: Type.String(),
        subcategoriesCount: Type.Integer({default: 0, minimum: 0}),
        subcategories: Type.Optional(Type.Array(Type.Ref(Type.Omit(responseSubcategorySchema, ['categoryId'])))),
        productsCount: Type.Integer({default: 0, minimum: 0}),
        products: Type.Optional(Type.Array(Type.Ref(Type.Omit(responseProductSchema, ['categoryId'])))),

    },
    {$id: "responseCategorySchema", additionalProperties: false}
)

export type ResponseCategory = Static<typeof responseCategorySchema>


export const routeGetCategorySchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage,
            data: responseCategorySchema
        }
    },
})


export const routeGetAllCategoriesSchema = routeSchema({
    tags: ['categories'],
    response: {
        200: {
            message: responseMessage,
            data: Type.Array(responseCategorySchema)
        }
    },
})
export const routeCreateCategorySchema = routeSchema({
    tags: ['categories'],
    body: createCategorySchema,
    response: {
        201: {
            message: responseMessage,
            data: responseCategorySchema
        }
    }
})
export const routeUpdateCategorySchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    body: updateCategorySchema,
    response: {
        200: {
            message: responseMessage,
            data: responseCategorySchema
        },
        304: {
            message: responseMessage
        }
    }
})
export const routeDeleteCategorySchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    response: {
        200: {
            message: responseMessage
        }
    }
})