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

async function addCategoryToDb(categoryInput: CreateCategoryInput): Promise<Category> {
    return await createCategoryService(categoryInput)
}

async function addSubcategoryToDb(categoryInput: CreateSubcategoryInput): Promise<Subcategory> {
    return await createSubcategoryService(categoryInput)
}

async function addProductToDb(productInput: CreateProductInput): Promise<Product> {
    return await createProductService(productInput)
}

async function addImageToProduct(productPath: string, productId: string): Promise<ProducImage> {
    const imageData: Buffer = fs.readFileSync(productPath)
    const imageResizer = new ImageResizer(imageData, productId, 1)
    const imagePaths = await imageResizer.saveAll()
    return await createProductImageService({
        productId: productId,
        order: 1,
        ...imagePaths
    })
}

async function walkSeedData(dataDir: string) {
    const categories = readDir(dataDir);
    // iter categories
    for (const categoryFolder of categories) {
        const categoryDir = path.join(dataDir, categoryFolder.name)
        const category = readCategory(categoryDir)
        console.log('Working on Category: ', category.name, 'id ', categoryFolder.name)
        const addedCategory: Category = await addCategoryToDb(
            {name: category.name, description: `Категория: ${category.name}`})
        const subcategories = readDir(categoryDir)
        // iter subcategories
        for (const subcategoryFolder of subcategories) {
            if (subcategoryFolder.isDirectory()) {  // avoid category.json
                const subcategoryDir = path.join(categoryDir, subcategoryFolder.name)
                const productsJsonDir = path.join(subcategoryDir, 'products/json')
                const productsImageDir = path.join(subcategoryDir, 'products/images')
                if (!fs.existsSync(productsJsonDir)) continue  // no products
                const subcategory: CreateSubcategoryInput = readSubcategory(subcategoryDir)
                console.log('Working on Subcategory: ', subcategory.name, 'id ', subcategoryFolder.name)
                const addedSubcategory: Subcategory =
                    await addSubcategoryToDb({
                        name: subcategory.name,
                        description: `Подкатегория: ${subcategory.name}`,
                        categoryId: addedCategory.id
                    })
                console.log(addedSubcategory.id)
                const productJsons = readDir(productsJsonDir)
                for (const productJsonFile of productJsons) {
                    if (!productJsonFile.name.endsWith('json')) continue
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

walkSeedData(path.join(__dirname, 'data'))