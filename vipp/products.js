import fetch from "node-fetch";
import { coreUrl } from "./constants.js";
import { saveProduct } from "./product.js";

export const saveProducts = (products, downloadFolder) => {
  return Promise.all(
    products.map((product) => saveProduct(product, downloadFolder))
  );
};

export const getLinksToProducts = async (amount, offset = 0) => {
  const url = toProductsUrl(amount, offset);
  const res = await fetch(url);
  const json = await res.json();

  const links = json.products.map((product) => encodeURI(product.link));

  return [links, hasMoreData(json)];
};

const toProductsUrl = (amount, offset = 0) => {
  const productsUrl = `${coreUrl}/no/api/products`;
  return `${productsUrl}?start=${offset}&amount=${amount}`;
};

const hasMoreData = (resJson) => {
  return resJson.rangeOffset === 0;
};
