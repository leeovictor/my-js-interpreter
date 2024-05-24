import { Expression } from "./Expression";
import { Token } from "./Token";

export interface StatementVisitor {
  visitBlock(block: Block): unknown;
  visitPrintStatement(printStm: PrintStatement): void;
  visitExpressionStatement(expressionStm: ExpressionStatement): void;
  visitVar(varDecl: Var): void;
  visitIf(ifStm: If): void;
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

export class Var extends Statement {
  constructor(
    public name: Token,
    public initializer: Expression | null,
  ) {
    super();
  }

  accept(visitor: StatementVisitor): void {
    visitor.visitVar(this);
  }
}

export class Block extends Statement {
  constructor(public statements: Array<Statement>) {
    super();
  }

  accept(visitor: StatementVisitor): void {
    visitor.visitBlock(this);
  }
}

export class If extends Statement {
  constructor(
    public condition: Expression,
    public thenBranch: Statement,
    public elseBranch: Statement | null,
  ) {
    super();
  }

  accept(visitor: StatementVisitor): void {
    visitor.visitIf(this);
  }
}
