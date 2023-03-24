import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSubcategoryInput, UpdateSubcategoryInput } from "./subcategory.schema";
import {
    createSubcategoryService,
    deleteSubcategoryService,
    getSubcategoryService,
    updateSubcategoryService
} from "./subcategory.service";
import { UuidParamsRequest } from "../shared/schemas";

export async function getSubcategoryHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const subcategory = await getSubcategoryService(id)
    return (subcategory)
        ? reply.code(200).send({message: "Success", data: subcategory})
        : reply.code(404);
}


export async function createSubcategoryHandler(
    request: FastifyRequest<{
        Body: CreateSubcategoryInput;
    }>,
    reply: FastifyReply
) {
    const result = await createSubcategoryService(request.body);
    return reply.code(201).send({message: "subcategory created", data: result});
}


export async function updateSubcategoryHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest, Body: UpdateSubcategoryInput }>,
    reply: FastifyReply
) {
    const result = await updateSubcategoryService(request.params.id, request.body);
    return reply.code(200).send({message: "subcategory updated", data: result});
}

export async function deleteSubcategoryHandler(
    request: FastifyRequest<{ Params: UuidParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.id
    const result = await deleteSubcategoryService(id)
    return reply.code(200).send({message: `Success. Subcategory with id ${id} deleted`, data: result});
}