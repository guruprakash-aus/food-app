import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService {

    private _repository: ICatalogRepository

    constructor(repository: ICatalogRepository) {
        this._repository = repository
    }

    async createProduct(input: any) {
        // return {
        //     id: 1,
        //     name: "some string",
        //     description: "Some desc",
        //     price: 35,
        //     stock:122,
        // }

        const data = await this._repository.create(input);
        if(!data.id) {
            throw new Error("Unable to Create Product")
        }
        return data;
    }

    async updateProduct(input: any) {
        const data = await this._repository.update(input);
        if(!data.id) {
            throw new Error("Unable to Update Product")
        }

        // emit event to update record in Elastic Search
        return data;
    }

    // instead of this we will get it from elastic search
    async getProducts(limit: number, offset: number) {
        const products = await this._repository.find(limit, offset)

        return products
    }

    async getProduct(id: number) {
        const product = await this._repository.findOne(id);

        return product
    }

    async deleteProduct(id: number) {
        const response = await this._repository.delete(id)
        // delete record from elastic search
        return response
    }
}