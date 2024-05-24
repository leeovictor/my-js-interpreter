import { TokenType } from "./TokenType";
import {
  Binary,
  Grouping,
  Literal,
  Unary,
  Expression,
  Variable,
  Assign,
} from "./Expression";
import { Lev } from "./index";
import { Token } from "./Token";
import {
  Block,
  ExpressionStatement,
  PrintStatement,
  Statement,
  Var,
} from "./Statement";

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

  parse(): Array<Statement> {
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  private declaration() {
    if (this.match(TokenType.VAR)) {
      return this.varDeclaration();
    }
    return this.statement();
  }

  private varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer: Expression | null = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declartion.");
    return new Var(name, initializer);
  }

  private statement(): Statement {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.LEFT_BRACE)) return new Block(this.block());

    return this.expressionStatement();
  }

  private block(): Statement[] {
    const statements = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private expressionStatement(): Statement {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new ExpressionStatement(expr);
  }

  private printStatement(): Statement {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new PrintStatement(expr);
  }

  private expression() {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.equality();
    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Variable) {
        const name = expr.name;
        return new Assign(name, value);
      }

      this.error(equals, "Invalid assignment target.");
    }
    return expr;
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
    if (this.match(TokenType.IDENTIFIER)) return new Variable(this.previous());

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
