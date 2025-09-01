import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
// import { CartRepositoryType } from "../types/repository.type";
import { logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";

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
  // get customer cart data
  const cart = await repo.findCart(id);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  // list out all line items in the cart
  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("cart items not found");
  }

  // verify with inventory service if the product is still available
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails)) {
    // update stock availability in cart line items
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItem.productId
      );
      if (stockItem) {
        lineItem.availability = stockItem.stock;
      }
    });

    // update cart line items
    cart.lineItems = lineItems;
  }
  // return updated cart data with latest stock availability
  return cart;
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
