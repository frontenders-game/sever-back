import prisma from "../../utils/prisma";
import { CreateProductInput, UpdateProductInput } from "./product.schema";
import { slugifyString } from "../../utils/misc";

export async function getProductService(productId: string) {
    return prisma.product.findUnique({
        where: {
            id: productId,
        },
        include: {
            promo: {
                select: {
                    id: true,
                    discountedPriceRegular: true,
                    discountedPriceWithCard: true,
                    discountPercent: true,
                    isActive: true,
                }
            },
            reviews: true,
            images: true
        }
    })
}
 
export async function createProductService(productInput: CreateProductInput) {
    const priceWithCard  = productInput.priceWithCard ? productInput.priceWithCard : productInput.priceRegular
    const ingredients = productInput.ingredients ? productInput.ingredients : undefined
    const subcategory = await prisma.subcategory.findFirst({
        where: {
            id: productInput.subcategoryId
        }
    })
    if (!subcategory) throw new Error(`No subcategory with id: ${productInput.subcategoryId} found`)

    const result = await prisma.product.create({
        data: {
            ...productInput,
            priceWithCard,
            ingredients,
            categoryId: subcategory.categoryId,
            slug: slugifyString(productInput.name),
            images: undefined,
            information: productInput.information ? {
                createMany: {
                    data: productInput.information
                }
            } : undefined,
            promo: productInput.promo ? {
                create: productInput.promo
            } : undefined
        }
    })
    await prisma.subcategory.update({
        where: {
            id: result.subcategoryId
        },
        data: {
            productsCount: {
                increment: 1
            }
        }
    })

    await prisma.category.update({
        where: {
            id: result.categoryId
        },
        data: {
            productsCount: {
                increment: 1
            }
        }
    })
    return result
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
                    where: { productId: productUpdate.id },
                }
            } : undefined,
            promo: productUpdate.promo ? {
                update: {
                    ...productUpdate.promo
                }
            } : undefined
            // @todo add product Images // ???
        }
    })
}

export async function deleteProductService(productId: string) {
    const result = await prisma.product.delete({
        where: {
            id: productId,
        },
    })
    await prisma.subcategory.update({
        where: {
            id: result.subcategoryId
        },
        data: {
            productsCount: {
                decrement: 1
            }
        }
    })
    await prisma.category.update({
        where: {
            id: result.categoryId
        },
        data: {
            productsCount: {
                decrement: 1
            }
        }
    })
    return result
}