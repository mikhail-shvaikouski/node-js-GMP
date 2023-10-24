import express from "express";
import {
  getUserCart,
  updateUserCart,
  emptyUserCart,
  checkoutCart,
} from "../controllers/cartController";
import { getProducts, getProductById } from "../controllers/productController";
import { loginUser } from "../controllers/authController";
import URL from "./urls";

const router = express.Router();

router.post(URL.LOGIN, loginUser);

router.get(URL.CART, getUserCart);
router.put(URL.CART, updateUserCart);
router.delete(URL.CART, emptyUserCart);
router.post(URL.CHECKOUT, checkoutCart);

router.get(URL.PRODUCTS, getProducts);
router.get(URL.PRODUCT_ID, getProductById);

export default router;
