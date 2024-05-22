import { readFile } from "fs/promises";
import { Scanner } from "./Scanner";
import { TokenType } from "./TokenType";
import { Parser } from "./Parser";
import { Token } from "./Token";
import { RuntimeError } from "./RuntimeError";
import { Interpreter } from "./Interpreter";

export class Lev {
  static hadError = false;
  static hadRuntimeError = false;
  static interpreter = new Interpreter();

  static runtimeError(err: RuntimeError) {
    console.error(`${err.message}\n[line ${err.token.line}]`);
    this.hadRuntimeError = true;
  }

  static error(line: number, message: string) {
    this.report(line, "", message);
  }

  static errorParser(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }

  static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }

  async run() {
    if (!process.argv[2]) {
      console.error("Error: source file not provided");
      process.exit(1);
    }

    try {
      const source = await readFile(process.argv[2], { encoding: "utf-8" });
      this.runSource(source);

      if (Lev.hadError || Lev.hadRuntimeError) process.exit(1);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  private runSource(source: string) {
    const tokens = new Scanner(source).scanTokens();
    const statements = new Parser(tokens).parse();

    if (Lev.hadError) return;

    Lev.interpreter.interpret(statements);
  }
}

void new Lev().run();
