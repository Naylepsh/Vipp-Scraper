import { config } from "dotenv";

config();

export const loadConfig = () => {
  return {
    shouldLog: getEnvVar("SHOULD_LOG"),
    downloadFolder: getEnvVar("DOWNLOAD_FOLDER") || "./downloads",
    csvPath: getEnvVar("CSV_PATH") || "./out.csv",
    batchSize: getEnvVar("BATCH_SIZE") || 20,
  };
};

const getEnvVar = (key) => {
  const value = process.env[key];

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (!isNaN(Number(value))) return Number(value);
  return value;
};
