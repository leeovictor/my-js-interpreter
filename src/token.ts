import { TokenType } from "./TokenType";

export class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal: unknown,
    public line: number,
  ) {}

  toString() {
    return `${this.type} ${this.lexeme} ${this.literalToTemplate()}`;
  }

  private literalToTemplate(): string | number {
    return typeof this.literal === "string" || typeof this.literal === "number"
      ? this.literal
      : "";
  }
}
