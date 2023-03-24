import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProductInput, UpdateProductInput } from "./product.schema";
import {
    createProductService,
    deleteProductService,
    getProductService,
    updateProductService
} from "./product.service";
import { UuidParamsRequest } from "../shared/schemas";

export async function getProductHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const product = await getProductService(id)
    product ?
        reply.code(200).send({message: "Success", data: product}) :
        reply.code(404);
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
    request: FastifyRequest<{ Params: UuidParamsRequest, Body: UpdateProductInput }>,
    reply: FastifyReply
) {
    const result = await updateProductService(request.params.id, request.body);
    return reply.code(200).send({message: "category updated", data: result});
}

export async function deleteProductHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const result = await deleteProductService(id)
    return reply.code(200).send({message: `Success. Product with id ${id} deleted`, data: result});
}