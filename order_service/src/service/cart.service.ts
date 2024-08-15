import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
// import { CartRepositoryType } from "../types/repository.type";
import { logger, NotFoundError } from "../utils";
import { GetProductDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput,
  repo: CartRepositoryType
) => {
  
    // Make a call to our catalog microservice
    // synchronised call
    const product = await GetProductDetails(input.productId)
    logger.info(product)
    if(product.stock < input.qty) {
        throw new NotFoundError("Product is out of stock");
    }
  
    // const data = await repo.create(input);
  // return { message: "created cart from service"}
  // return data;

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant
  } as CartLineItem)

  // return product;
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.findCart(id);

  if (!data) {
    throw new NotFoundError("Cart Not Found")
  }

  return data;
};

export const EditCart = async (input: CartEditRequestInput, repo: CartRepositoryType) => {
  const data = await repo.updateCart(input.id, input.qty);
  // return { message: "created cart from service" };
  return data
};

export const DeleteCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.deleteCart(id);
  // return { message: "created cart from service" };
  return data
};
