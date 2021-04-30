import { saveImages } from "../product/saveImages.js";

export const saveProducts = (products, save, downloadFolder) => {
  return Promise.all([
    ...products.map((product) =>
      saveImages(product.sku, product.images, downloadFolder)
    ),
    save(products),
  ]);
};

