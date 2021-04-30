import { createObjectCsvWriter } from "csv-writer";

export const saveProductsToCsv = (dest) => {
  const csvWriter = getCsvWriter(dest);
  return (products) => csvWriter.writeRecords(products);
};

const getCsvWriter = (dest) => {
  return createObjectCsvWriter({
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
      { id: "attribute1", title: "attribute_1" },
      { id: "attribute2", title: "attribute_2" },
      { id: "attribute3", title: "attribute_3" },
      { id: "fast_track", title: "fast_track" },
      { id: "delivery_time", title: "delivery_time" },
    ],
  });
};
