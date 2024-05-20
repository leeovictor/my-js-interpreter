import { readFile } from "fs/promises";
import { Scanner } from "./scanner.js";
import { TokenType } from "./token-type.js";
import { Parser } from "./parser.js";

let hadError = false;

const run = (source) => {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);
  const ast = parser.parse();

  if (hadError) {
    return;
  }

  console.log(ast);
};

export const error = (line, message) => {
  report(line, "", message);
};

export const errorParser = (token, message) => {
  if (token.type === TokenType.EOF) {
    report(token.line, " at end", message);
  } else {
    report(token.line, " at '" + token.lexeme + "'", message);
  }
};

const report = (line, where, message) => {
  console.log(`[line ${line}] Error${where}: ${message}`);
  hadError = true;
};

if (!process.argv[2]) {
  console.log("Error: source file not provided");
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
