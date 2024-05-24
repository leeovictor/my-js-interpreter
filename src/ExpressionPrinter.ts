import {
  Assign,
  Binary,
  Expression,
  Grouping,
  Literal,
  Unary,
  Variable,
  ExpressionVisitor,
} from "./Expression";

export class ExpressionPrinter implements ExpressionVisitor<string> {
  print(ast: Expression) {
    return ast.accept(this);
  }

  visitAssign(assign: Assign): string {
    return `= ${assign.name.lexeme}:${assign.value.accept(this)}`;
  }

  visitBinary(binary: Binary): string {
    return `${binary.operator.lexeme} ${binary.left.accept(this)} ${binary.right.accept(this)}`;
  }

  visitGrouping(grouping: Grouping): string {
    return `( ${grouping.expression.accept(this)} )`;
  }

  visitLiteral(literal: Literal): string {
    return (literal.value as string | number).toString();
  }

  visitUnary(unary: Unary): string {
    return `${unary.operator.lexeme} ${unary.right.accept(this)}`;
  }

  visitVariable(variable: Variable): string {
    return `(var) ${variable.name.lexeme}`;
  }
}
