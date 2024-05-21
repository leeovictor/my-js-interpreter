import {
  Binary,
  Expression,
  Grouping,
  Literal,
  Unary,
  Visitor,
} from "./Expression";

export class AstPrinter implements Visitor<string> {
  print(ast: Expression) {
    return ast.accept(this);
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
}
