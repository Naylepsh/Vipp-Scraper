import { getProduct } from "./vipp/product.js";
import { getLinksToProducts, saveProducts } from "./vipp/products.js";
import { log } from "./utils/logger.js";

const main = async () => {
  const amount = 20;
  let offset = 100;
  while (true) {
    log(`Loading products: ${offset}-${offset + amount}`);

    const [links, hasMore] = await getLinksToProducts(amount, offset);
    const products = await Promise.all(
      links.map((link) => getProduct(link, log))
    );
    saveProducts(products);

    if (!hasMore) {
      break;
    }

    offset += amount;
  }

  log("Done with all the products");
};

main();
