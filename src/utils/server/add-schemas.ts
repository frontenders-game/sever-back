import {
    createProductInformationSchema,
    createProductSchema,
    responseProductImageSchema,
    responseProductReviewSchema,
    responseProductInformationSchema,
    responseProductSchema
} from "../../modules/products/product.schema";
import {
    createCategorySchema,
    getCategoryQuery,
    responseCategorySchema,
} from "../../modules/categories/category.schema";

import { FastifyInstance } from "fastify";
import { registerUserSchema } from "../../modules/users/user.schema";

export default function addSchemas(server: FastifyInstance) {
    [
        getCategoryQuery,
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
