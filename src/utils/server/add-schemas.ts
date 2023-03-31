import { FastifyInstance } from "fastify";
import {
    createProductInformationSchema,
    createProductSchema,
    responseProductImageSchema,
    responseProductReviewSchema,
    responseProductInformationSchema,
    responseProductSchema,
    filterProductsQuery
} from "../../modules/products/product.schema";

import {
    filterCategoryProductsQuery,
    createCategorySchema,
    responseCategorySchema,
} from "../../modules/categories/category.schema";
import { registerUserSchema } from "../../modules/users/user.schema";

export default function addSchemas(server: FastifyInstance) {
    [
        filterProductsQuery,
        filterCategoryProductsQuery,
        createProductInformationSchema,
        createProductSchema,
        responseProductInformationSchema,
        responseProductReviewSchema,
        responseProductImageSchema,
        responseProductSchema,
        createCategorySchema,
        responseCategorySchema,
        registerUserSchema
    ].forEach(schema => server.addSchema(schema))
}
