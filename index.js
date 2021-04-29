import { getProduct } from "./vipp/product.js";
import { getLinksToProducts } from "./vipp/products.js";

const main = async () => {
  // const links = await getLinksToProducts();
  // const link = '/no/products/cabin-kjøkkenstol' // those meme letters dont work
  const link = "/no/products/bademodul-medium-0";
  const data = await getProduct(link);
  console.log(data);
};

main();
