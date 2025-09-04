import express, { NextFunction, Request, Response } from "express";
// import { MessageBroker } from "../utils";
// import { OrderEvent } from "../types";
import { RequestAuthorizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderRepository } from "../repository/order.repository";
import { CartRepository } from "../repository/cart.repository";
import { OrderStatus } from "../types";

const repo = OrderRepository;
const cartRepo = CartRepository;
const router = express.Router();

router.post(
  "/orders",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.CreateOrder(user.id, repo, cartRepo);
    return res.status(200).json(response);
  }
);

router.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.GetOrders(user.id, repo);
    return res.status(200).json(response);
  }
);

router.get(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.GetOrder(user.id, repo);
    return res.status(200).json(response);
  }
);

// Both are TODO: Implement
// only going to call from microservice
router.patch(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // security check for microservice calls only
    const orderId = parseInt(req.params.id);
    const status = req.body.status as OrderStatus;
    const response = await service.UpdateOrder(orderId, status, repo);
    return res.status(200).json(response);
  }
);

// only going to call from microservice
router.delete(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const orderId = parseInt(req.params.id);
    const response = await service.DeleteOrder(orderId, repo);
    return res.status(200).json(response);
  }
);


// router.post(
//   "/order",
//   RequestAuthorizer,
//   async (req: Request, res: Response, next: NextFunction) => {
//     //  order create logic

//     //  Kafka Step 3 : Publish the Message
//     // await MessageBroker.publish({
//     //   topic: "OrderEvents",
//     //   headers: { token: req.headers.authorization },
//     //   event: OrderEvent.CREATE_ORDER,
//     //   message: {
//     //     orderId: 1,
//     //     items: [
//     //       {
//     //         productId: 1,
//     //         quanity: 1,
//     //       },
//     //       {
//     //         productId: 2,
//     //         quantity: 2,
//     //       },
//     //     ],
//     //   },
//     //    });
//     // return res.status(200).json({ message: "create order" });

//     async (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user;
//     if (!user) {
//       next(new Error("User not found"));
//       return;
//     }
//     const response = await service.CreateOrder(user.id, repo, cartRepo);
//     return res.status(200).json(response);

 
//   }
// );

// router.get(
//   "/order",
//   async (req: Request, res: Response, next: NextFunction) => {
//     return res.status(200).json({ message: "Get All orders" });
//   }
// );

// router.get(
//   "/order/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     return res.status(200).json({ message: "Get order" });
//   }
// );

// router.delete(
//   "/order/:id",
//   async (req: Request, res: Response, next: NextFunction) => {
//     return res.status(200).json({ message: "Delete order" });
//   }
// );

export default router;
