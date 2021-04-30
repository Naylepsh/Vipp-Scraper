export const isNumeric = (x) => {
  // allows comma separators
  const str = ("" + x).replace(/\,/g, ".");
  return !isNaN(parseFloat(str)) && isFinite(str);
};
