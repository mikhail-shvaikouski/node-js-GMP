import { Request, Response } from "express";
import * as Joi from "joi";
import { CartResponce } from "../entities/cart.entity";
import {
  getCart,
  getCartResponce,
  getOrCreateUserCart,
} from "../services/cart.service";
import { getResponse } from "../services/resp.service";

const updateCartSchema = Joi.object({
  productId: Joi.string().required(),
  count: Joi.number().integer().required(),
});

export const getUserCart = (req: Request, res: Response) => {
  const userId = req.userId;

  if (userId) {
    const userCart = getOrCreateUserCart(userId);
    const userCartResp = getCartResponce(userCart);

    return res.status(200).json(getResponse<CartResponce>(userCartResp, null));
  } else {
    res.status(401).json(getResponse(null, { message: "Unauthorized" }));
  }
};

export const updateUserCart = (req: Request, res: Response) => {
  const requestData = req.body;

  const { error } = updateCartSchema.validate(requestData);

  if (error) {
    return res.status(400).json(getResponse(null, error));
  }

  // Implement your cart update logic here

  return res.status(200).json({ message: "Cart updated successfully" });
};

export const emptyUserCart = (req: Request, res: Response) => {
  const userId = req.userId;

  if (userId) {
    const userCart = getCart(userId);

    if (userCart) {
      userCart.isDeleted = true;

      return res.status(200).json(
        getResponse(
          {
            success: true,
          },
          null
        )
      );
    }
  }
};

export const checkoutCart = (req: Request, res: Response) => {
  // Implement logic to create an order from the user's cart
};
