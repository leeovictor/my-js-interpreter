import { Expression } from "./Expression";

export interface StatementVisitor {
  visitPrintStatement(printStm: PrintStatement): void;
  visitExpressionStatement(expressionStm: ExpressionStatement): void;
}

export abstract class Statement {
  abstract accept(visitor: StatementVisitor): void;
}

export class ExpressionStatement extends Statement {
  constructor(public expression: Expression) {
    super();
  }

  accept(visitor: StatementVisitor) {
    visitor.visitExpressionStatement(this);
  }
}

export class PrintStatement extends Statement {
  constructor(public expression: Expression) {
    super();
  }

  accept(visitor: StatementVisitor) {
    visitor.visitPrintStatement(this);
  }
}
