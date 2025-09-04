import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
// import { CartRepositoryType } from "../types/repository.type";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  // Make a call to our catalog microservice
  // synchronised call

  // get product details from catalog service
  const product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("Product is out of stock");
  }

  //  fimd if the product is already in cart
  const lineItem = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );
  if (lineItem) {
    return repo.updateCart(lineItem.id, input.qty + lineItem.qty);
  }
  // const data = await repo.create(input);
  // return { message: "created cart from service"}
  // return data;

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);

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

const AuthorisedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizeError("you are not authorized to edit this cart");
  }

  return lineItem;
};

export const EditCart = async (
  input: CartEditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  // Check if the cart item belongs to the user
  await AuthorisedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  // return { message: "created cart from service" };
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  // Check if the cart item belongs to the user
  await AuthorisedCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  // return { message: "created cart from service" };
  return data;
};
