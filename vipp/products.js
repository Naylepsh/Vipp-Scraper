import fetch from "node-fetch";
import { coreUrl } from "./constants.js";

const toProductsUrl = (amount, offset = 0) => {
  const productsUrl = `${coreUrl}/no/api/products`;
  return `${productsUrl}?start=${offset}&amount=${amount}`;
};

const hasMoreData = (resJson) => {
  return resJson.rangeOffset === 0;
};

export const getLinksToProducts = async () => {
  const links = [];
  const amount = 100;
  let offset = 0;
  while (true) {
    const url = toProductsUrl(amount, offset);
    const res = await fetch(url);
    const json = await res.json();

    const linksThisIter = json.products.map((product) => product.link);
    links.push(...linksThisIter);

    if (!hasMoreData(json)) {
      break;
    }

    offset += amount;
  }

  return links;
};
