import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import { HandleErrorWithLogger, httpLogger } from "./utils";

const app = express();
app.use(cors());
app.use(express.json());

app.use(httpLogger);

app.use(cartRoutes);
app.use(orderRoutes);

app.use("/", (req: Request, res: Response, _: NextFunction) => {
  return res.status(200).json({ message: "Order Service is Healthy" });
});

app.use(HandleErrorWithLogger);

export default app;
