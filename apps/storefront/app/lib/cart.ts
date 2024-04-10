// returns true if a product is found in the cart
export const isProductInCart = (cart, productId: string) => {
  if (!cart) {
    return false;
  }

  const validLineItems = cart?.lines?.edges.filter(
    (item) => item?.node?.quantity >= 1
  );

  if (!validLineItems || !validLineItems.length) {
    return false;
  }

  return validLineItems.some(
    (item) => item.node.merchandise.product.id == productId
  );
};
