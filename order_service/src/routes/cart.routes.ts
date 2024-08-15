import express, { NextFunction, Request, Response } from 'express'
import * as service from '../service/cart.service'
import * as repository from '../repository/cart.repository'
import { ValidateRequest } from '../utils/validator'
import { CartEditRequestInput, CartRequestInput, CartRequestSchema } from '../dto/cartRequest.dto'

const router = express.Router()
const cartRepo = repository.CartRepository

// If any routes need a middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    //jwt
    const isValidator = true;
    if (!isValidator) {
        return res.status(403).json({error: "authorization error"})
    }

    next()
}


router.post("/cart", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {

        //Validate the Request
        const error = ValidateRequest<CartEditRequestInput>(
            req.body,
            CartRequestSchema
        );

        if (error) {
            return res.status(404).json({error})
        }

        const response = await service.CreateCart(req.body as CartRequestInput, cartRepo)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({error})
    }
    
})

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
    // Comes from our auth user parsed from JWT
    const response = await service.GetCart(req.body.customerId, cartRepo)
    return res.status(200).json(response)
})

router.patch("/cart/:lineItemId", async (req: Request, res: Response, next: NextFunction) => {
    const cartLineItemId = req.params.lineItemId
    const response = await service.EditCart({
        id: +cartLineItemId,
        qty: req.body.qty
    }, cartRepo)
    return res.status(200).json(response)
})

router.delete("/cart/:lineItemId", async (req: Request, res: Response, next: NextFunction) => {
    const cartLineItemId = req.params.lineItemId
    const response = await service.DeleteCart(+cartLineItemId, cartRepo)
    return res.status(200).json(response)
})

export default router