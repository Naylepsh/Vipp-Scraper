import { mkdir } from "fs/promises";
import { runScraper } from "./vipp/scraper.js";
import { consoleLogger, nullLogger } from "./utils/logger.js";
import { saveProductsToCsv } from "./utils/csvWriter.js";

const main = async () => {
  const options = {
    shouldLog: true,
    downloadFolder: "./downloads",
    csvPath: "./out.csv",
    batchSize: 20,
  };
  const { log, save } = await setup(options);
  await runScraper(options, save, log);
};

const setup = async ({ downloadFolder, csvPath, shouldLog }) => {
  await createDownloadFolder(downloadFolder);

  const log = shouldLog ? consoleLogger : nullLogger;
  const save = saveProductsToCsv(csvPath);

  return { log, save };
};

const createDownloadFolder = async (downloadFolder) => {
  try {
    await mkdir(downloadFolder);
  } catch (_e) {}
};

main();
