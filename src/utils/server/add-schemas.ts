import { FastifyInstance } from "fastify";
import {
    createProductInformationSchema,
    createProductSchema,
    responseProductImageSchema,
    responseProductReviewSchema,
    responseProductInformationSchema,
    responseProductSchema, filterProductQuery
} from "../../modules/products/product.schema";

import {
    createCategorySchema,
    responseCategorySchema,
} from "../../modules/categories/category.schema";
import { registerUserSchema } from "../../modules/users/user.schema";

export default function addSchemas(server: FastifyInstance) {
    [
        filterProductQuery,
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
