import prisma from "../../utils/prisma";
import { CreateProductInput, GetProductWhereCondition, UpdateProductInput } from "./product.schema";
import { slugifyString } from "../../utils/misc";


export async function getProductService(whereFilter: GetProductWhereCondition) {
    return prisma.product.findUnique({
        where: {
            ...whereFilter
        },
        include: {
            reviews: true,
            images: true,
            information: true,
            category: true,
        }
    })
}

export async function createProductService(productInput: CreateProductInput) {
    const subcategory = await prisma.category.findFirst({
        where: {
            id: productInput.subcategoryId
        }
    })
    if (!subcategory) throw new Error(
        `No subcategory with id: ${productInput.subcategoryId} found`)

    const priceWithCard = productInput.priceWithCard ? productInput.priceWithCard : productInput.priceRegular
    const ingredients = productInput.ingredients ? productInput.ingredients : undefined

    if (!subcategory.parentCategoryId) throw new Error(
        `Subcategory with id: ${productInput.subcategoryId} doesn't have parent Category`)

    return prisma.product.create({
        data: {
            ...productInput,
            priceWithCard,
            ingredients,
            categoryId: subcategory.parentCategoryId,
            slug: slugifyString(productInput.name),
            images: undefined,
            information: productInput.information ? {
                createMany: {
                    data: productInput.information
                }
            } : undefined
        }
    })

}

export async function updateProductService(productId: string, productUpdate: UpdateProductInput) {
    return prisma.product.update({
        where: {
            id: productUpdate.id,
        },
        data: {
            ...productUpdate,
            slug: slugifyString(productUpdate.name),
            information: productUpdate.information ? {
                updateMany: {
                    data: productUpdate.information,
                    where: {productId: productUpdate.id},
                }
            } : undefined
        }
    })
}

export async function deleteProductService(productId: string) {
    return prisma.product.delete({
        where: {
            id: productId,
        },
    })
}