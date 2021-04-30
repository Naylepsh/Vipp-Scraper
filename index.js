import { getProduct } from "./vipp/product.js";
import { getLinksToProducts } from "./vipp/products.js";

const main = async () => {
  const links = await getLinksToProducts();
  // const link = '/no/products/cabin-kjøkkenstol' // those meme letters dont work
  // const link = "/no/products/bademodul-medium-0";
  // const link = "/no/products/pedalb%C3%B8tte-4-l";
  // const link = "/no/products/vannkoker";
  // const data = await getProduct(link);
  const xs = links.slice(0, 5);
  const data = await Promise.all(xs.map(getProduct));
  for (const d of data) {
    console.log(d);
  }
};

main();
