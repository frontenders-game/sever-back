import fs from "fs";
import path from "path";
import { Category, ProducImage, Product, Subcategory } from "@prisma/client"; //
import { CreateCategoryInput } from "../src/modules/categories/category.schema";
import { CreateSubcategoryInput } from "../src/modules/subcategories/subcategory.schema";
import { CreateProductInput } from "../src/modules/products/product.schema";
import { createCategoryService } from "../src/modules/categories/category.service";
import { createSubcategoryService } from "../src/modules/subcategories/subcategory.service";
import { createProductService } from "../src/modules/products/product.service";
import ImageResizer from "../src/utils/image-utils";
import { createProductImageService } from "../src/modules/products/images/image.service";

const readDir = (dir: string) => fs.readdirSync(dir, {withFileTypes: true})


// type ReadJsonOutput = CreateProductInput | CreateSubcategoryInput | CreateCategoryInput
const readJson = (jsonPath: string) => {
    const file = fs.readFileSync(jsonPath, 'utf8')
    return JSON.parse(file)
}
const readCategory = (categoryDir: string): CreateCategoryInput => readJson(`${categoryDir}/category.json`)
const readSubcategory = (subcategoryDir: string): CreateSubcategoryInput => readJson(`${subcategoryDir}/subcategory.json`)

// const readProduct = (categoryId, subcategoryId) =>
//     readJson(`data/${categoryId}/${subcategoryId}/subcategory.json`)

async function addCategoryToDb(categoryInput: CreateCategoryInput): Promise<Category> {
    const dbCategory: Category = await createCategoryService(categoryInput)
    return dbCategory
}

async function addSubcategoryToDb(categoryInput: CreateSubcategoryInput): Promise<Subcategory> {
    const dbSubcategory: Subcategory = await createSubcategoryService(categoryInput)
    return dbSubcategory
}

async function addProductToDb(productInput: CreateProductInput): Promise<Product> {
    const dbProduct: Product = await createProductService(productInput)
    return dbProduct
}

async function addImageToProduct(productPath: string, productId: string): Promise<ProducImage> {
    const imageData: Buffer = fs.readFileSync(productPath)
    const imageResizer = new ImageResizer(imageData, productId, 1)
    const imagePaths = await imageResizer.saveAll()
    const image = await createProductImageService({
        productId: productId,
        order: 1,
        ...imagePaths
    })
    return image
}

async function walkSeedData(dataDir: string) {
    const categories = readDir(dataDir);
    // iter categories
    for (const categoryId of categories) {
        const categoryDir = path.join(dataDir, categoryId.name)
        const category = readCategory(categoryDir)
        console.log('Working on Category: ', category.name)
        const addedCategory: Category = await addCategoryToDb(
            {name: category.name, description: `Категория: ${category.name}`})
        const subcategories = readDir(categoryDir)
        // iter subcategories
        for (const subcategoryId of subcategories) {
            if (subcategoryId.isDirectory()) {  // avoid category.json
                const subcategoryDir = path.join(categoryDir, subcategoryId.name)
                const subcategory: CreateSubcategoryInput = readSubcategory(subcategoryDir)
                console.log('Working on Subcategory: ', subcategory)
                const addedSubcategory: Subcategory =
                    await addSubcategoryToDb({
                        name: subcategory.name,
                        description: `Подкатегория: ${subcategory.name}`,
                        categoryId: addedCategory.id
                    })
                console.log(addedSubcategory.id)
                const productsJsonDir = path.join(subcategoryDir, 'products/json')
                const productsImageDir = path.join(subcategoryDir, 'products/images')
                if (!fs.existsSync(productsJsonDir)) continue  // no products
                const productJsons = readDir(productsJsonDir)
                for (const productJsonFile of productJsons) {
                    if (productJsonFile.name.endsWith('json')) {
                        const product: CreateProductInput =
                            readJson(path.join(productsJsonDir, productJsonFile.name))
                        const addedProduct =
                            await addProductToDb({...product, subcategoryId: addedSubcategory.id})
                        console.log('added product:', addedProduct.id, product.name)
                        const productImagePath = path.join(productsImageDir, productJsonFile.name.replace('.json', ''), '1.jpg')
                        const addedProductImage = await addImageToProduct(productImagePath, addedProduct.id)
                        console.log(`added image: ${addedProductImage.id} for product ${addedProduct.id}`)

                    }
                }
            }
        }
    }
}

walkSeedData(path.join(__dirname, 'data'))