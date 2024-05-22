import { TokenType } from "./TokenType";
import { Binary, Grouping, Literal, Unary, Expression } from "./Expression";
import { Lev } from "./index";
import { Token } from "./Token";

class ParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParserError";
  }
}

export class Parser {
  tokens: Array<Token>;
  current = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  parse() {
    try {
      return this.expression();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private expression() {
    return this.equality();
  }

  private equality() {
    return this.parseLeftAssociateBinaryOp(
      [TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL],
      () => this.comparison(),
    );
  }

  private comparison() {
    return this.parseLeftAssociateBinaryOp(
      [
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      ],
      () => this.term(),
    );
  }

  private term() {
    return this.parseLeftAssociateBinaryOp(
      [TokenType.MINUS, TokenType.PLUS],
      () => this.factor(),
    );
  }

  private factor() {
    return this.parseLeftAssociateBinaryOp(
      [TokenType.SLASH, TokenType.STAR],
      () => this.unary(),
    );
  }

  private unary(): Expression {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }
    return this.primary();
  }

  private primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression");
      return new Grouping(expr);
    }

    throw this.error(this.peek(), "Expect expression");
  }

  private parseLeftAssociateBinaryOp(
    tokens: Array<TokenType>,
    operandLambda: () => Expression,
  ): Expression {
    let expr = operandLambda();
    while (this.match(...tokens)) {
      const operator = this.previous();
      const right = operandLambda();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  private consume(tokenType: TokenType, message: string) {
    if (this.check(tokenType)) return this.advance();

    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string) {
    Lev.errorParser(token, message);
    return new ParserError(message);
  }

  private synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
      this.advance();
    }
  }

  private match(...tokenTypes: Array<TokenType>) {
    for (const type of tokenTypes) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  private peek() {
    return this.tokens[this.current];
  }

  private previous() {
    return this.tokens[this.current - 1];
  }
}
