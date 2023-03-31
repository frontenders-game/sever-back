import { Static, Type } from "@sinclair/typebox"
import {
    idSchema,
    nameType,
    responseMessage,
    slugParamsType,
    slugType,
    uuidOrSlugParamsType,
    uuidParamsType,
    uuidType
} from "../shared/schemas";
import { filterProductQuery, responseProductSchema } from "../products/product.schema";
import { routeSchema } from "../../types";


export const getCategoryWhereCondition = uuidOrSlugParamsType

export type GetCategoryWhereCondition = Static<typeof getCategoryWhereCondition>


export const createCategorySchema = Type.Object(
    {
        name: nameType,
        order: Type.Optional(Type.Integer()),
        description: Type.Optional(Type.String()),
    },
    {$id: "createCategorySchema", additionalProperties: false}
)

export type CreateCategoryInput = Static<typeof createCategorySchema>

export const createSubcategorySchema = Type.Intersect(
    [
        createCategorySchema,
        Type.Object({parentCategoryId: Type.Optional(uuidType)})
    ],
    {$id: "createSubcategorySchema", additionalProperties: false}
)

export type CreateSubcategoryInput = Static<typeof createSubcategorySchema>

export const updateCategorySchema = Type.Intersect([createCategorySchema, idSchema])
export type UpdateCategoryInput = Static<typeof updateCategorySchema>

// export const updateSubcategorySchema = Type.Intersect([createSubcategorySchema, idSchema])
// export type UpdateSubcategoryInput = Static<typeof updateSubcategorySchema>

export const responseCategorySchema =
    Type.Object(
        {
            id: uuidType,
            name: nameType,
            slug: slugType,
            order: Type.Integer({minimum: 1}),
            description: Type.Optional(Type.String()),
            parentCategoryId: Type.Optional(uuidType),
            subcategories: Type.Optional(Type.Array(Type.Intersect([idSchema, createCategorySchema, Type.Object({slug: slugType})]))),
            subcategoriesCount: Type.Optional(Type.Integer({minimum: 0})),
            filter: Type.Optional(Type.Ref(filterProductQuery)),
            productsCount: Type.Optional(Type.Integer({default: 0, minimum: 0})),
            productsMinPrice: Type.Optional(Type.Integer()),
            productsMaxPrice: Type.Optional(Type.Integer()),
            products: Type.Optional(Type.Array(Type.Ref(Type.Omit(responseProductSchema, ['categoryId'])))),
        },
        {$id: "responseCategorySchema", additionalProperties: false}
    )

export type ResponseCategory = Static<typeof responseCategorySchema>

export const routeGetCategoryByIdSchema = routeSchema({
    tags: ['categories'],
    params: uuidParamsType,
    querystring: filterProductQuery,
    response: {
        200: {
            message: responseMessage,
            data: responseCategorySchema
        }
    },
})


export const routeGetCategoryBySlugSchema = routeSchema({
    tags: ['categories'],
    params: slugParamsType,
    querystring: filterProductQuery,
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
export const routeCreateSubcategorySchema = routeSchema({
    tags: ['subcategories'],
    body: createSubcategorySchema,
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
//
//
// export const routeGetSubcategoryByIdSchema = routeSchema({
//     tags: ['subcategories'],
//     params: uuidParamsType,
//     querystring: filterProductQuery,
//     response: {
//         200: {
//             message: responseMessage,
//             data: responseCategorySchema
//         }
//     },
// })
//
//
// export const routeGetSubcategoryBySlugSchema = routeSchema({
//     tags: ['subcategories'],
//     params: slugParamsType,
//     querystring: filterProductQuery,
//     response: {
//         200: {
//             message: responseMessage,
//             data: responseCategorySchema
//         }
//     },
// })
//
//
// export const routeCreateSubcategorySchema = routeSchema({
//     tags: ['subcategories'],
//     body: createSubcategorySchema,
//     response: {
//         201: {
//             message: responseMessage,
//             data: responseCategorySchema
//         }
//     }
// })
//
// export const routeUpdateSubcategorySchema = routeSchema({
//     tags: ['subcategories'],
//     params: uuidParamsType,
//     body: updateSubcategorySchema,
//     response: {
//         200: {
//             message: responseMessage,
//             data: responseCategorySchema
//         },
//         304: {
//             message: responseMessage
//         }
//     }
// })
// export const routeDeleteSubcategorySchema = routeSchema({
//     tags: ['subcategories'],
//     params: uuidParamsType,
//     response: {
//         200: {
//             message: responseMessage
//         }
//     }
// })