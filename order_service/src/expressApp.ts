import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import { HandleErrorWithLogger, httpLogger, MessageBroker } from "./utils";
import { Consumer, Producer } from "kafkajs";


export const ExpressApp = async() => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  app.use(httpLogger);
  

  //  Kafka Step 1: connect to producer and consumer
  // const producer = await MessageBroker.connectProducer<Producer>();
  // producer.on("producer.connect", () => {
  //   console.log("producer connected")
  // })

  // const consumer = await MessageBroker.connectConsumer<Consumer>();
  // consumer.on("consumer.connect", () => {
  //   console.log("Consumer connected")
  // })

  // //  Kafka Step 2: Subscribe to topic or publish the message
  // await MessageBroker.subscribe((message) => {
  //   // connect to catalog service
  //   console.log("consumer received a message");
  //   console.log("message received", message)
  // }, "OrderEvents")

  app.use(cartRoutes);
  app.use(orderRoutes);
  
  app.use("/", (req: Request, res: Response, _: NextFunction) => {
    return res.status(200).json({ message: "Order Service is Healthy" });
  });
  
  app.use(HandleErrorWithLogger);

  return app
}

