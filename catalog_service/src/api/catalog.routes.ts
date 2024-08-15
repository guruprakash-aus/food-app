import express, { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.repository";
import { RequestValidator } from "../utils/requestValidator";
import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";

const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

//endpoints
router.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(201).json({});
    try {
      // Validate the input
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );

      if (errors) return res.status(400).json(errors);

      const data = await catalogService.createProduct(req.body);
      return res.status(201).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.patch(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(201).json({});
    try {
      // Validate the input
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body
      );

      const id = parseInt(req.params.id) || 0;

      if (errors) return res.status(400).json(errors);

      const data = await catalogService.updateProduct({ id, ...input });
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(201).json({});
    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);

    try {
      const data = await catalogService.getProducts(limit, offset);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(201).json({});
    const id = parseInt(req.params.id) || 0;

    try {
      const data = await catalogService.getProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      // const err = error as Error;
      // console.log(err)
      // return res.status(500).json(err.message);

      // We can implement API Gateways here for proper communications
      return next(error)
    }
  }
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(201).json({});
    const id = parseInt(req.params.id) || 0;

    try {
      const data = await catalogService.deleteProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

export default router;
