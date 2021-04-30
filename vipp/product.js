import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { supplier, brand, coreUrl } from "./constants.js";

export const getProduct = async (url) => {
  const res = await fetch(toProductUrl(url));
  const text = await res.text();

  const { document } = new JSDOM(text).window;

  const summary = document.querySelector(".product-info__flag > div");
  const data = getProductDataFromSummary(summary);
  return data;
};

const toProductUrl = (url) => {
  return `${coreUrl}/${url}`;
};

const getProductDataFromSummary = (summary) => {
  const sku = getSku(summary);
  const [name, variant] = getNameAndVariant(summary);
  const description = getDescription(summary);
  const [price, currency] = getPriceAndCurrency(summary);

  return { sku, brand, supplier, name, variant, description, price, currency };
};

const getSku = (summary) => {
  const text = summary.querySelector("h4").textContent;
  const brandPrefix = brand.replace(/\s+/g, "").toLowerCase();
  return `${brandPrefix}-${text}`;
};

const getNameAndVariant = (summary) => {
  const text = summary.querySelector("h1").textContent;
  const [name, variant] = text.split(", ").map((t) => t.trim());
  return [name, variant];
};

const getDescription = (summary) => {
  return summary.querySelector("div").textContent;
};

const getPriceAndCurrency = (summary) => {
  const text = summary.querySelector("p#price-product").textContent;
  const [price, currency] = text.split(" ");
  return [price, currency];
};
