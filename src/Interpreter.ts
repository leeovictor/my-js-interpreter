import { Lev } from ".";
import {
  Binary,
  Expression,
  Grouping,
  Literal,
  Unary,
  Visitor,
} from "./Expression";
import { RuntimeError } from "./RuntimeError";
import {
  ExpressionStatement,
  PrintStatement,
  Statement,
  StatementVisitor,
} from "./Statement";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Interpreter implements Visitor<unknown>, StatementVisitor {
  interpret(statements: Array<Statement>) {
    try {
      for (const stm of statements) {
        this.execute(stm);
      }
    } catch (err) {
      if (err instanceof RuntimeError) {
        Lev.runtimeError(err);
      }
    }
  }

  visitPrintStatement(printStm: PrintStatement): void {
    const value = this.evaluate(printStm.expression);
    console.log(value);
  }

  visitExpressionStatement(expressionStm: ExpressionStatement): void {
    this.evaluate(expressionStm.expression);
  }

  visitLiteral(literal: Literal): unknown {
    return literal.value;
  }

  visitGrouping(grouping: Grouping): unknown {
    return this.evaluate(grouping.expression);
  }

  visitUnary(unary: Unary): unknown {
    const right = this.evaluate(unary.right);

    switch (unary.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(unary.operator, right);
        return -(right as number);
    }
    return null;
  }

  visitBinary(binary: Binary): unknown {
    const left = this.evaluate(binary.left);
    const right = this.evaluate(binary.right);

    switch (binary.operator.type) {
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(right, left);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(right, left);
      case TokenType.GREATER:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) > (right as number);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) >= (right as number);
      case TokenType.LESS:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) < (right as number);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) <= (right as number);
      case TokenType.MINUS:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) - (right as number);
      case TokenType.PLUS:
        // string concat operator overload
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }

        throw new RuntimeError(
          binary.operator,
          "Operands must be strings or numbers.",
        );
      case TokenType.SLASH:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) / (right as number);
      case TokenType.STAR:
        this.checkNumberOperands(binary.operator, left, right);
        return (left as number) * (right as number);
    }
  }

  private execute(stm: Statement) {
    stm.accept(this);
  }

  private checkNumberOperand(operator: Token, operand: unknown) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  private checkNumberOperands(operator: Token, left: unknown, right: unknown) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  private isEqual(a: unknown, b: unknown): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
  }

  private isTruthy(literal: unknown): boolean {
    if (literal === null) return false;
    if (typeof literal === "boolean") return literal;
    return true;
  }

  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
}
