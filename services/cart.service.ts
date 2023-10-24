import { cart, CartEntity, CartResponce } from "../entities/cart.entity";
const { v4: uuidv4 } = require("uuid");

const getCart = (userId: string) => {
  if (cart.userId === userId) {
    return cart;
  }
};

const getTotal = (data: CartEntity): number => {
  return data.items.reduce(
    (acc, item) => acc + item.product.price * item.count,
    0
  );
};

const getCartResponce = (cartData: CartEntity): CartResponce => {
  return { cart: cartData, total: getTotal(cartData) };
};

const getOrCreateUserCart = (userId: string): CartEntity => {
  const existingCart: CartEntity | undefined = getCart(userId);

  if (existingCart && !existingCart.isDeleted) {
    return existingCart;
  } else {
    const newCart: CartEntity = {
      id: uuidv4(),
      userId: userId,
      isDeleted: false,
      items: [],
    };

    return newCart;
  }
};

export { getCart, getCartResponce, getOrCreateUserCart };
