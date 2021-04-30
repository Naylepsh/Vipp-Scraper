import { getProduct } from "./product/getProduct.js";
import { getLinksToProducts } from "./products/getLinksToProducts.js";
import { saveProducts } from "./products/saveProducts.js";

export const runScraper = async ({ downloadFolder, batchSize }, save, log) => {
  let offset = 0;

  while (true) {
    log(`Loading products: ${offset}-${offset + batchSize}`);

    const [links, hasMore] = await getLinksToProducts(batchSize, offset);
    const products = await Promise.all(
      links.map((link) => getProduct(link, log))
    );

    log("Saving products....");
    await saveProducts(products, save, downloadFolder);

    if (!hasMore) {
      break;
    }

    offset += batchSize;
  }

  log("Scraping completed.");
};
