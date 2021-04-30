import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { supplier, brand, coreUrl } from "./constants.js";
import { capitalize } from "../utils/capitalize.js";

export const saveProduct = (product) => {};

export const getProduct = async (url, log) => {
  let status;
  try {
    if (log) {
      log(`Processing ${url}...`);
    }

    const res = await fetch(toProductUrl(url));
    const text = await res.text();
    status = res.status;

    const { document } = new JSDOM(text).window;

    const summary = document.querySelector(".product-info__flag > div");
    const details = document.querySelector("#product-detail > div > div");
    const data = {
      ...getProductDataFromSummary(summary),
      ...getProductDataFromDetails(details),
    };

    if (log) {
      log(`Processing ${url}: Done`);
    }

    return data;
  } catch (error) {
    const msg = `Failure during processing of product at url: ${url}:\n${error.message};${error.stack}`;
    log(msg);
    log(`res: ${status}`);
    return [];
  }
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
  const dimensions = getDimensions(details);
  const designer = getDesigner(details);
  const material = getMaterial(details);
  const weight = getWeight(details);

  return { designer, material, weight, ...dimensions };
};

const getDimensions = (details) => {
  const dimensionsDiv = getRowFromDetails(details, "Dimensjoner");
  if (!dimensionsDiv) return;

  const dimensions = dimensionsDiv.children[1].textContent
    .replace(/\s+/g, "")
    .split("cm")[0] // removes notes
    .split(":");
  const [names, values] = dimensions.map((dim) => dim.split("x"));
  if (!names || !values) return {};

  const length = getLength(names, values);
  // sometimes length acts as either one of width, height or depth
  const width = getWidth(names, values) || length;
  const height = getHeight(names, values) || length;
  const depth = getDepth(names, values) || length;

  return {
    width,
    height,
    depth,
    dimensions: toDimensions(width, height, depth, "cm"),
  };
};

const getWidth = (names, values) => {
  return getDimension("B", names, values);
};

const getHeight = (names, values) => {
  return getDimension("H", names, values);
};

const getDepth = (names, values) => {
  return getDimension("D", names, values);
};

const getLength = (names, values) => {
  return getDimension("L", names, values);
};

const getDimension = (dimension, names, values) => {
  const i = names.indexOf(dimension);
  return values[i];
};

const toDimensions = (height, width, depth, unit) => {
  if (height && width && depth) {
    return `H: ${height} x W: ${width} x D: ${depth} ${unit}`;
  }
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
