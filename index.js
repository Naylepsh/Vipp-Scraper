import { getProduct } from "./vipp/product.js";
import { mkdir } from "fs/promises";
import { getLinksToProducts, saveProducts } from "./vipp/products.js";

const main = async () => {
  const shouldLog = true;
  const downloadFolder = "./downloads";
  await setup(downloadFolder);
  await runScraper(shouldLog, downloadFolder);
};

const setup = async (downloadFolder) => {
  try {
    await mkdir(downloadFolder);
  } catch (_e) {}
};

const runScraper = async (shouldLog, downloadFolder) => {
  const amount = 20;
  let offset = 125;
  while (true) {
    console.log(`Loading products: ${offset}-${offset + amount}`);

    const [links, hasMore] = await getLinksToProducts(amount, offset);
    const products = await Promise.all(
      links.map((link) => getProduct(link, shouldLog))
    );
    await saveProducts(products, downloadFolder);

    if (!hasMore) {
      break;
    }

    offset += amount;
  }

  console.log("Scraping completed.");
};

main();
