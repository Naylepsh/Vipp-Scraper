import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { supplier, brand, coreUrl } from "./constants.js";
import { capitalize } from "../utils/capitalize.js";

export const getProduct = async (url) => {
  const res = await fetch(toProductUrl(url));
  const text = await res.text();

  const { document } = new JSDOM(text).window;

  const summary = document.querySelector(".product-info__flag > div");
  const details = document.querySelector("#product-detail > div > div");
  const data = {
    ...getProductDataFromSummary(summary),
    ...getProductDataFromDetails(details),
  };

  return data;
};

const toProductUrl = (url) => {
  return `${coreUrl}/${url}`;
};

const getProductDataFromSummary = (summary) => {
  const sku = getSku(summary);
  const { name, variant } = getNameAndVariant(summary);
  const description = getDescription(summary);
  const { price, currency } = getPriceAndCurrency(summary);

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
  return { name, variant };
};

const getDescription = (summary) => {
  return summary.querySelector("div").textContent;
};

const getPriceAndCurrency = (summary) => {
  const text = summary.querySelector("p#price-product").textContent;
  const [price, currency] = text.split(" ");
  return { price, currency };
};

const getProductDataFromDetails = (details) => {
  getDimensions(details);
  const designer = getDesigner(details);
  const material = getMaterial(details);
  const weight = getWeight(details);

  return { designer, material, weight };
};

const getDimensions = (details) => {
  const dimensionsDiv = getRowFromDetails(details, "Dimensjoner");

  const dimensions = dimensionsDiv.children[1].textContent.split(":");
  // TODO
};

const getWeight = (details) => {
  const weightDiv = getRowFromDetails(details, "Vekt");
  if (!weightDiv) return;

  const weight = weightDiv.querySelector("p").textContent.split(".")[0];

  return weight;
};

const getDesigner = (details) => {
  const designerDiv = getRowFromDetails(details, "Design");
  if (!designerDiv) return;

  const designer = designerDiv.querySelector("p").textContent.split(",")[0];

  return designer;
};

const getMaterial = (details) => {
  const materialDiv = getRowFromDetails(details, "Materialer");
  if (!materialDiv) return;

  const material = materialDiv
    .querySelector("p")
    .textContent.split(".")[0]
    .replace(/\s+/g, "")
    .split(",")
    .map(capitalize)
    .join("/");

  return material;
};

const getRowFromDetails = (details, rowName) => {
  return Array.from(details.querySelectorAll(".line")).find(
    (element) => element.children[0].textContent === rowName
  );
};
