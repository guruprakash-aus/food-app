import { CartRepositoryType } from "../types/repository.type";
import * as Repository from "../repository/cart.repository";

import { CreateCart } from "./cart.service";

describe("cartService", () => {
  let cartRepo: CartRepositoryType;

  beforeEach(() => {
    cartRepo = Repository.CartRepository;
  });

  afterEach(() => {
    cartRepo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      title: "pen drive",
      amount: 24,
    };

    jest.spyOn(Repository.CartRepository, "create").mockImplementationOnce(() =>
      Promise.resolve({
        message: "fake response from cart repository",
        input: mockCart,
      })
    );

    const res = await CreateCart(mockCart, cartRepo);

    expect(res).toEqual({
      message: "fake response from cart repository",
      input: mockCart,
    });
  });
});
