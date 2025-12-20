import chalk from "chalk";

// HELPERS
const timestamp = () =>
  new Date().toISOString().replace("T", " ").split(".")[0];

const isProd = process.env.NODE_ENV === "production";

// LOGGER
const logger = {
  info: (msg) => {
    if (!isProd)
      console.log(
        chalk.blue(`[INFO] ${timestamp()} → ${msg}`)
      );
  },

  success: (msg) => {
    console.log(
      chalk.green(`[SUCCESS] ${timestamp()} → ${msg}`)
    );
  },

  warn: (msg) => {
    console.warn(
      chalk.yellow(`[WARN] ${timestamp()} → ${msg}`)
    );
  },

  error: (msg, err) => {
    console.error(
      chalk.red(`[ERROR] ${timestamp()} → ${msg}`)
    );
    if (err && !isProd) console.error(err);
  },

  request: (method, route, status) => {
    const color =
      status >= 500
        ? chalk.red
        : status >= 400
          ? chalk.yellow
          : chalk.magenta;

    console.log(
      color(
        `[REQUEST] ${timestamp()} → ${method} ${route} ${status ? `(${status})` : ""
        }`
      )
    );
  },
};

export default logger;
