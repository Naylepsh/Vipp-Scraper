import { mkdir } from "fs/promises";
import { runScraper } from "./scraper/index.js";
import { consoleLogger, nullLogger } from "./utils/logger.js";
import { saveProductsToCsv } from "./utils/csvWriter.js";
import { loadConfig } from "./config.js";

const main = async () => {
  const config = loadConfig();
  const { log, save } = await setup(config);
  await runScraper(config, save, log);
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
