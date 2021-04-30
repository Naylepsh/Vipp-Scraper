import { resolve, join } from "path";
import { downloadFile } from "../../utils/download.js";

export const saveProduct = ({ images, ...product }, dest) => {
  return Promise.all([
    saveImages(product.sku, images, dest),
    saveProductToCSV(product),
  ]);
};

const saveImages = (sku, urls, dest) => {
  const toDest = toPath(dest);
  if (urls.length === 1) {
    const path = toDest(`${sku}.jpg`);
    return downloadFile(urls[0], path);
  } else {
    return Promise.all(
      urls.map((url, index) => {
        const path = toDest(`${sku}_${index}.jpg`);
        return downloadFile(url, path);
      })
    );
  }
};

const toPath = (folder) => (filename) => join(resolve(), folder, filename);

const saveProductToCSV = (product) => {
  return;
};
