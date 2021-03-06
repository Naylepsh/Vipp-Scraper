import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { supplier, brand, coreUrl } from "../constants.js";
import { capitalize } from "../../utils/capitalize.js";
import { isNumeric } from "../../utils/isNumeric.js";

export const getProduct = async (url, log) => {
  const absoluteUrl = toProductUrl(url);
  try {
    log(`Processing ${absoluteUrl}...`);

    const res = await fetch(absoluteUrl);
    const text = await res.text();

    const { document } = new JSDOM(text).window;

    const summary = document.querySelector(".product-info__flag > div");
    const details = document.querySelector("#product-detail > div > div");
    const gallery = document.querySelector("#module-product-info__gallery");
    const data = {
      ...getProductDataFromSummary(summary),
      ...getProductDataFromDetails(details),
      images: getImagesFromGallery(gallery),
    };

    log(`Processing ${absoluteUrl}: Done`);

    return data;
  } catch (error) {
    const msg = `Failure during processing of product at url: ${absoluteUrl}:\n${error.message};${error.stack}`;
    log(msg);
    return {};
  }
};

const toProductUrl = (url) => {
  return `${coreUrl}${url}`;
};

const getImagesFromGallery = (gallery) => {
  const imgs = gallery.querySelectorAll("img");
  return Array.from(imgs).map((img) => img.src);
};

const getProductDataFromSummary = (summary) => {
  const sku = getSku(summary);
  const { name, variant } = getNameAndVariant(summary);
  const description = getDescription(summary);
  const { price, currency } = getPriceAndCurrency(summary);
  const { name: attributeName, attribute } = getAttributeFromVariant(variant);

  return {
    sku,
    brand,
    supplier,
    name,
    variant,
    description,
    price,
    currency,
    names: attributeName,
    attribute1: attribute,
  };
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

const getAttributeFromVariant = (variant) => {
  if (!variant) {
    return {};
  }

  for (const [classifier, name] of classifiedAttributes) {
    if (classifier(variant)) {
      return { name, attribute: variant };
    }
  }

  return { name: "Unclassified", attribute: variant };
};

const isSizeAttribute = (variant) => {
  return ["small", "medium", "large"].includes(variant);
};

const isVolumeAttribute = (variant) => {
  if (!variant) return false;

  const [volume, unit] = variant.split(" ");
  return isNumeric(volume) && unit === "L";
};

const isShapeAttribute = (variant) => {
  const [shape] = variant.split(" ");
  return ["rund", "firkantet"].includes(shape);
};

const classifiedAttributes = [
  [isSizeAttribute, "Size"],
  [isVolumeAttribute, "Volume"],
  [isShapeAttribute, "Shape"],
];

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
  const value = values[i];
  return isNumeric(value) ? value : undefined;
};

const toDimensions = (height, width, depth, unit) => {
  const heightStr = toDimensionStr("H", height);
  const widthStr = toDimensionStr("W", width);
  const depthStr = toDimensionStr("D", depth);
  const unitStr = height || width || depth ? ` ${unit}` : "";

  return (
    [heightStr, widthStr, depthStr]
      .filter((dim) => dim.length > 3)
      .join(" x ") + unitStr
  );
};

const toDimensionStr = (symbol, value) => {
  return value ? `${symbol}: ${value}` : "";
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
