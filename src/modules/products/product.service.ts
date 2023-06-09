import prisma from "../../utils/prisma";
import {
    CreateProductInput,
    FilterProductsQuery,
    GetProductWhereCondition,
    ProcessProducts,
    ResponseProduct,
    UpdateProductInput
} from "./product.schema";
import { slugifyString } from "../../utils/misc";


export async function processProducts(products: ResponseProduct[]): Promise<ProcessProducts> {
    const prices = []
    for (const product of products) {
        product.averageRating = (Array.isArray(product.reviews) && product.reviews.length > 0)
            ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
            : 0
        prices.push(Number(product.priceRegular))
        prices.push(Number(product.priceWithCard))
        if (product.discountedPrice) prices.push(Number(product.discountedPrice))

    }
    const result = {
        products: products,
        productsResultCount: products.length,
        productsResultMaxPrice: 0,
        productsResultMinPrice: 0
    }
    if (prices.length > 0) {
        result.productsResultMaxPrice = Math.max(...prices)
        result.productsResultMinPrice = Math.min(...prices)
    }
    return result
}


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

export async function getAllProductsService(filterOptions: FilterProductsQuery) {
    const {
        categoryId,
        subcategoryId,
        offset,
        limit,
        searchText,
        isNew,
        discountIsActive,
        inStock,
        sortPrice,
        maxPrice,
        minPrice
    } = filterOptions
    return prisma.product.findMany({
            where: {
                priceWithCard: {
                    gte: minPrice,
                    lte: maxPrice
                },
                name: searchText ? {
                    contains: searchText,
                    mode: 'insensitive',
                } : undefined,
                categoryId,
                subcategoryId,
                isNew,
                discountIsActive,
                stockCount: {
                    gt: inStock ? 0 : undefined
                }
            },
            skip: offset,
            take: limit,
            include: {
                images: true,
                reviews: true,
                information: true,
                category: true
            },
            orderBy: sortPrice ? {
                priceWithCard: sortPrice
            } : undefined
        }
    )
}

export async function getProductsStats( filterOptions: FilterProductsQuery) {
   const  { categoryId,
            subcategoryId,
            isNew,
       discountIsActive,
            inStock,
            maxPrice,
            minPrice
    } = filterOptions
    return prisma.product.aggregate({
        where: {
            priceWithCard: {
                gte: minPrice,
                lte: maxPrice
            },
            categoryId,
            subcategoryId,
            isNew,
            discountIsActive,
            stockCount: inStock ? {gt: 0} : undefined
        },
        _count: {
            id: true
        },
        _min: {
            priceWithCard: true,
            discountedPrice: true
        },
        _max: {
            priceRegular: true
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