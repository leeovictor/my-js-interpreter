import { readFile } from "fs/promises";
import { Scanner } from "./scanner.js";

let hadError = false;

const run = (source) => {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();

  for (const token of tokens) {
    console.log(token.toString());
  }
};

export const error = (line, message) => {
  report(line, "", message);
};

const report = (line, where, message) => {
  console.log(`[line ${line}] Error${where}: ${message}`);
  hadError = true;
};

if (!process.argv[2]) {
  console.log("Error: source file  not provided");
  process.exit(1);
}

try {
  const source = await readFile(process.argv[2], { encoding: "utf-8" });
  run(source);
  if (hadError) {
    process.exit(1);
  }
} catch (err) {
  console.log(err);
  process.exit(1);
}
