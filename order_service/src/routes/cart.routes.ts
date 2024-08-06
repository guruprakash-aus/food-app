import express, { NextFunction, Request, Response } from 'express'
import * as service from '../service/cart.service'
import * as repository from '../repository/cart.repository'

const router = express.Router()
const cartRepo = repository.CartRepository

router.post("/cart", async (req: Request, res: Response, next: NextFunction) => {

    const response = await service.CreateCart(req.body, cartRepo)
    return res.status(200).json(response)
})

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.GetCart(req.body, cartRepo)
    return res.status(200).json(response)
})

router.patch("/cart", async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.EditCart(req.body, cartRepo)
    return res.status(200).json(response)
})

router.delete("/cart", async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.DeleteCart(req.body, cartRepo)
    return res.status(200).json(response)
})

export default router