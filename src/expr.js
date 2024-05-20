class Expression {}

export class Binary extends Expression {
  /**
   *
   * @param {Expression} left
   * @param {Token} operator
   * @param {Expression} right
   */
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class Grouping extends Expression {
  /**
   *
   * @param {Expression} expression
   */
  constructor(expression) {
    super();
    this.expression = expression;
  }
}

export class Literal extends Expression {
  /**
   *
   * @param {object} value
   */
  constructor(value) {
    super();
    this.value = value;
  }
}

export class Unary extends Expression {
  /**
   *
   * @param {Token} operator
   * @param {Expression} right
   */
  constructor(operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }
}
