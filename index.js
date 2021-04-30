import { mkdir } from "fs/promises";
import { runScraper } from "./vipp/scraper.js";
import { consoleLogger, nullLogger } from "./utils/logger.js";

const main = async () => {
  const options = {
    shouldLog: true,
    downloadFolder: "./downloads",
  };
  const { log } = await setup(options);
  await runScraper(options.downloadFolder, log);
};

const setup = async ({ downloadFolder, shouldLog }) => {
  await createDownloadFolder(downloadFolder);
  const log = shouldLog ? consoleLogger : nullLogger;
  return { log };
};

const createDownloadFolder = async (downloadFolder) => {
  try {
    await mkdir(downloadFolder);
  } catch (_e) {}
};

main();
