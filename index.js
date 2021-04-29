import { getLinksToProducts } from "./vipp/products.js";

const main = async () => {
  const links = await getLinksToProducts();
  console.log(links);
};

main();
