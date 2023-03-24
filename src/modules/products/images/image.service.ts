import prisma from "../../../utils/prisma";
import { CreateProductImageInput} from "./image.schema";

export async function getProductImageService(imageId: string) {
    return prisma.producImage.findUnique({
        where: {
            id: imageId,
        }
    })
}

export async function getProductImageMaxOrderValue(productId: string) {
    const result = await prisma.producImage.aggregate({
        where: {
            productId: productId,
        },
        _max: {
                order: true
            }
    })
    return result._max.order || 0
}

export async function createProductImageService(imageInput: CreateProductImageInput) {
    return prisma.producImage.create({
        data: {
            ...imageInput
        }
    })
}

export async function deleteProductImageService(imageId: string) {
    return prisma.producImage.delete({
        where: {
            id: imageId,
        },
    })
}