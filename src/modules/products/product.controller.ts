import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProductInput, FilterProductsQuery, ResponseProduct, UpdateProductInput } from "./product.schema";
import {
    createProductService,
    deleteProductService,
    getAllProductsService,
    getProductService, getProductsStats,
    processProducts,
    updateProductService
} from "./product.service";
import { UuidOrSlugParams, UuidParams } from "../shared/schemas";

export async function getProductHandler(
    request: FastifyRequest<{ Params: UuidOrSlugParams }>,
    reply: FastifyReply
) {

    const product = await getProductService(request.params)
    product ?
        reply.code(200).send({message: "Success", data: product}) :
        reply.code(404).send({error: `Product with ${JSON.stringify(request.params)} not found.`});
}


export async function getAllProductsHandler(
    request: FastifyRequest<{ Querystring: FilterProductsQuery }>,
    reply: FastifyReply
) {
    const filter = request.query
    const products = await getAllProductsService(filter) as unknown as ResponseProduct[]
    const result = await processProducts(products)
    const stats = await getProductsStats(filter)
    result.productsTotalCount = stats._count.id
    result.productsTotalMinPrice = Math.min(Number(stats._min.priceWithCard), Number(stats._min.discountedPrice))
    result.productsTotalMaxPrice = Math.min(Number(stats._max.priceRegular))
    reply.code(200).send({
        message: "Success",
        data: {...result, filter: request.query}
    })
}


    export async function createProductHandler(
        request: FastifyRequest<{
            Body: CreateProductInput;
        }>,
        reply: FastifyReply
    ) {
        const result = await createProductService(request.body);
        return reply.code(201).send({message: "product created", data: result});
    }


    export async function updateProductHandler(
        request: FastifyRequest<{ Params: UuidParams, Body: UpdateProductInput }>,
        reply: FastifyReply
    ) {
        const result = await updateProductService(request.params.id, request.body);
        return reply.code(200).send({message: "category updated", data: result});
    }

    export async function deleteProductHandler(
        request: FastifyRequest<{ Params: UuidParams }>,
        reply: FastifyReply
    ) {
        const id = request.params.id
        const result = await deleteProductService(id)
        return reply.code(200).send({message: `Success. Product with id ${id} deleted`, data: result});
    }