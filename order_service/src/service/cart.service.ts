import { CartRepositoryType } from "../types/repository.type"

export const CreateCart = async (input: any, repo: CartRepositoryType) => {

    const data = await repo.create(input);
    // return { message: "created cart from service"}
    return data
}

export const GetCart = async (input: any,repo: CartRepositoryType) => {
    const data = await repo.find(input);
    return { message: "created cart from service"}
}

export const EditCart = async (input: any, repo: CartRepositoryType) => {
    const data = await repo.update(input);
    return { message: "created cart from service"}
}

export const DeleteCart = async (input: any, repo: CartRepositoryType) => {
    const data = await repo.delete(input);
    return { message: "created cart from service"}
}