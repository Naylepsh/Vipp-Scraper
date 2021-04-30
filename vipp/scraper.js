import { getProduct } from "./product/getProduct.js";
import { getLinksToProducts } from "./products/getLinksToProducts.js";
import { saveProducts } from "./products/saveProducts.js";

export const runScraper = async ({ downloadFolder, csvPath }, log) => {
  const amount = 20;
  let offset = 125;
  while (true) {
    log(`Loading products: ${offset}-${offset + amount}`);

    const [links, hasMore] = await getLinksToProducts(amount, offset);
    const products = await Promise.all(
      links.map((link) => getProduct(link, log))
    );
    await saveProducts(products, csvPath, downloadFolder);

    if (!hasMore) {
      break;
    }

    offset += amount;
  }

  log("Scraping completed.");
};
