import { Request, Response } from "express";
import { products, ProductEntity } from "../entities/product.entity";
import { getResponse } from "../services/resp.service";

const getProducts = (req: Request, res: Response) => {
  return res.status(200).json(getResponse<ProductEntity[]>(products, null));
};

const getProductById = (req: Request, res: Response) => {
  const productId = req.params.productId;
  const product = products.filter((product) => product.id === productId);

  if (!product.length) {
    return res
      .status(404)
      .json(getResponse(null, { message: "No product with such id" }));
  }

  return res.status(200).json(getResponse<ProductEntity[]>(product, null));
};

export { getProducts, getProductById };
