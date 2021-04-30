import { saveProduct } from "../product/saveProduct.js";

export const saveProducts = (products, downloadFolder) => {
  return Promise.all(
    products.map((product) => saveProduct(product, downloadFolder))
  );
};
