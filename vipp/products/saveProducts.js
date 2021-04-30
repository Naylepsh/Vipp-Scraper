import { saveImages } from "../product/saveImages.js";
import { createObjectCsvWriter } from "csv-writer";

let csvWriter;

export const saveProducts = (products, csvPath, downloadFolder) => {
  return Promise.all([
    ...products.map((product) =>
      saveImages(product.sku, product.images, downloadFolder)
    ),
    saveProductsToCsv(products, csvPath),
  ]);
};

const saveProductsToCsv = (products, dest) => {
  const csvWriter = getCsvWriter(dest);
  return csvWriter.writeRecords(products);
};

const getCsvWriter = (dest) => {
  if (!csvWriter) {
    csvWriter = createObjectCsvWriter({
      path: dest,
      header: [
        { id: "sku", title: "sku" },
        { id: "category", title: "category" },
        { id: "style", title: "style" },
        { id: "brand", title: "brand" },
        { id: "supplier", title: "supplier" },
        { id: "parent_product", title: "parent_product" },
        { id: "name", title: "product_name" },
        { id: "variant", title: "variant_name" },
        { id: "description", title: "description" },
        { id: "price", title: "price" },
        { id: "currency", title: "currency" },
        { id: "colors", title: "colors" },
        { id: "width", title: "width" },
        { id: "height", title: "height" },
        { id: "depth", title: "depth" },
        { id: "room_type", title: "room_type" },
        { id: "collection", title: "collection" },
        { id: "designer", title: "designer" },
        { id: "awards", title: "awards" },
        { id: "material", title: "material" },
        { id: "material_filter", title: "material_filter" },
        { id: "dimensions", title: "dimensions" },
        { id: "setter", title: "setter" },
        { id: "names", title: "names" },
        { id: "attribute_1", title: "attribute_1" },
        { id: "attribute_2", title: "attribute_2" },
        { id: "attribute_3", title: "attribute_3" },
        { id: "fast_track", title: "fast_track" },
        { id: "delivery_time", title: "delivery_time" },
      ],
    });
  }
  return csvWriter;
};
