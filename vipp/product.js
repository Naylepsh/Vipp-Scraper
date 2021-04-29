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
  const sku = createSku(summary.querySelector("h4").textContent);
  const [name, variant] = createNameAndVariant(
    summary.querySelector("h1").textContent
  );
  const description = summary.querySelector("div").textContent;

  return { sku, brand, supplier, name, variant, description };
};

const createSku = (text) => {
  const brandPrefix = brand.replace(/\s+/g, "").toLowerCase();
  return `${brandPrefix}-${text}`;
};

const createNameAndVariant = (text) => {
  return text.split(", ").map((t) => t.trim());
};
