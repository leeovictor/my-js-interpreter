import { Token } from "./Token";

export interface Visitor<R> {
  visitAssign(assign: Assign): R;
  visitBinary(binary: Binary): R;
  visitGrouping(grouping: Grouping): R;
  visitLiteral(literal: Literal): R;
  visitUnary(unary: Unary): R;
  visitVariable(variable: Variable): R;
}

export abstract class Expression {
  abstract accept<R>(visitor: Visitor<R>): R;
}

export class Binary extends Expression {
  constructor(
    public left: Expression,
    public operator: Token,
    public right: Expression,
  ) {
    super();
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinary(this);
  }
}

export class Grouping extends Expression {
  constructor(public expression: Expression) {
    super();
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGrouping(this);
  }
}

export class Literal extends Expression {
  constructor(public value: unknown) {
    super();
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteral(this);
  }
}

export class Unary extends Expression {
  constructor(
    public operator: Token,
    public right: Expression,
  ) {
    super();
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnary(this);
  }
}

export class Variable extends Expression {
  constructor(public name: Token) {
    super();
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitVariable(this);
  }
}

export class Assign extends Expression {
  constructor(
    public name: Token,
    public value: Expression,
  ) {
    super();
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitAssign(this);
  }
}
