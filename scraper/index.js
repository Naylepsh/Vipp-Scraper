import { getProduct } from "./product/getProduct.js";
import { getLinksToProducts } from "./products/getLinksToProducts.js";
import { saveProducts } from "./products/saveProducts.js";

export const runScraper = async ({ downloadFolder, batchSize }, save, log) => {
  let offset = 0;

  while (true) {
    log("Loading next batch...");
    const [links, hasMore] = await getLinksToProducts(batchSize, offset);

    log(`Loading products: ${offset}-${offset + links.length}`);
    const products = await Promise.all(
      links.map((link) => getProduct(link, log))
    );
    log("Products loaded.");

    log("Saving products....");
    await saveProducts(products, save, downloadFolder);
    log("Products saved.");

    if (!hasMore) {
      break;
    }

    offset += batchSize;
  }

  log("Scraping completed.");
};
