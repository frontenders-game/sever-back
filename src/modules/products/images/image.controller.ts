import { FastifyReply, FastifyRequest } from "fastify";
import {
    UploadProductImage,
    UuidImageParamsRequest,
    UuidProductIdParamsRequest } from "./image.schema";
import {
    getProductImageService,
    deleteProductImageService,
    createProductImageService,
    getProductImageMaxOrderValue
} from "./image.service";
import ImageResizer from "../../../utils/image-utils";


export async function getProductImageHandler(
    request: FastifyRequest<{ Params: UuidImageParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.imageId
    const image = await getProductImageService(id)
    image ?
        reply.code(200).send({message: "Success", data: image}) :
        reply.code(404);
}

//
// export async function createProductImageHandler(
//     request: FastifyRequest<{
//         Body: CreateProductImageInput;
//     }>,
//     reply: FastifyReply
// ) {
//     const result = await createProductImageService(request.body);
//     return reply.code(201).send({message: "product created", data: result});
// }


export async function deleteProductImageHandler(
    request: FastifyRequest<{ Params: UuidImageParamsRequest }>,
    reply: FastifyReply
) {
    const id = request.params.imageId
    const result = await deleteProductImageService(id)
    return reply.code(200).send({message: `Success. Image with id ${id} deleted`, data: result});
}

export async function uploadProductImageHandler(
    request: FastifyRequest<{ Params: UuidProductIdParamsRequest, Body: UploadProductImage }>,
    reply: FastifyReply
) {
    if (!request.isMultipart()) {
        return reply.code(400).send({ error: "Request is not multipart" })
    }
    const productId = request.params.productId

    const data = await request.body.file.toBuffer();

    if (!data) return reply.code(500).send({error: 'File error'})
    const currentMaxOrder = await getProductImageMaxOrderValue(productId)
    const order = currentMaxOrder + 1
    const imageResizer = new ImageResizer(data, productId, order)
    const full: string = await imageResizer.saveFull()
    const small: string = await imageResizer.saveSmall()
    const thumb: string = await imageResizer.saveThumb()
    const image = await createProductImageService({
        productId: productId,
        full,
        small,
        thumb,
        order
    })
    return reply.code(200).send({message: `Success. Image uploaded.`, data: image});

}