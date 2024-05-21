import { TokenType } from "./TokenType";

export class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal: unknown,
    public line: number,
  ) {}

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
