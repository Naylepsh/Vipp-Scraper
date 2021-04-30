import { getProduct } from "./vipp/product.js";
import { getLinksToProducts, saveProducts } from "./vipp/products.js";

const main = async () => {
  const shouldLog = true;
  await runScraper(shouldLog);
};

const runScraper = async (shouldLog) => {
  const amount = 20;
  let offset = 100;
  while (true) {
    console.log(`Loading products: ${offset}-${offset + amount}`);

    const [links, hasMore] = await getLinksToProducts(amount, offset);
    const products = await Promise.all(
      links.map((link) => getProduct(link, shouldLog))
    );
    saveProducts(products);

    if (!hasMore) {
      break;
    }

    offset += amount;
  }

  console.log("Scraping completed.");
};

main();
