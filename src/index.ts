import { readFile } from "fs/promises";
import { Scanner } from "./Scanner";
import { TokenType } from "./TokenType";
import { Parser } from "./Parser";
import { Token } from "./Token";

export class Lev {
  static hadError = false;

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
    console.log(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }

  async run() {
    if (!process.argv[2]) {
      console.log("Error: source file not provided");
      process.exit(1);
    }

    try {
      const source = await readFile(process.argv[2], { encoding: "utf-8" });
      this.runSource(source);

      if (Lev.hadError) {
        process.exit(1);
      }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  private runSource(source: string) {
    const tokens = new Scanner(source).scanTokens();
    console.log(tokens);
    const astTree = new Parser(tokens).parse();
    console.log(astTree);

    if (Lev.hadError) {
      return;
    }
  }
}

new Lev().run();
