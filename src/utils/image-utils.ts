import Jimp from "jimp";

export default class ImageResizer {

    constructor(private readonly imageBuffer: Buffer,
                private readonly productId: string,
                private readonly imageOrder: number,
                private readonly saveFolder: string = `${String(process.env.PUBLIC_DIR)}/products/images/`) {
    }

    private async resizeAndWrite(width: number,
                                 height: number,
                                 fileName: string,
                                 fileExtension: string = 'jpg',
                                 quality: number = 95
    ): Promise<string> {
        const relativePath = `${this.saveFolder}${this.productId}/${this.imageOrder}/${fileName}.${fileExtension}`
        const savePath = `./${process.env.BUILD_DIR}/${relativePath}`

        const image = await Jimp.read(this.imageBuffer);
        const w = image.bitmap.width
        const h = image.bitmap.height
        // Save and overwrite the image
        if ((h !== height && w !== width) || (h !== Jimp.AUTO && w !== Jimp.AUTO)) {
            (h > w)
                ? await image.resize(Jimp.AUTO, height, Jimp.RESIZE_BEZIER)  // horizontal
                : await image.resize(width, Jimp.AUTO, Jimp.RESIZE_BEZIER)  // vertical
        }

        await image.quality(quality).writeAsync(savePath);
        return `${process.env.SERVER_URL}/${relativePath}`
    }

    public async saveFull(): Promise<string> {
        return await this.resizeAndWrite(800, 800, '800x800', 'jpg')
    }

    public async saveSmall(): Promise<string> {
        return await this.resizeAndWrite(300, 300, '300x300', 'jpg')
    }

    public async saveThumb(): Promise<string> {
        return await this.resizeAndWrite(80, 80, '80x80', 'jpg', 100)
    }

    public async saveNoResize(fileName: string): Promise<string> {
        return await this.resizeAndWrite(80, 80, fileName, 'jpg')
    }

}


