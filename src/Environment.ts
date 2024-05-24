import { RuntimeError } from "./RuntimeError";
import { Token } from "./Token";

export class Environment {
  private values = new Map<string, unknown>();
  parent: Environment | null = null;

  constructor(parentEnv: Environment | null = null) {
    this.parent = parentEnv;
  }

  define(name: string, value: unknown) {
    this.values.set(name, value);
  }

  get(name: Token): unknown {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    if (this.parent !== null) {
      return this.parent.get(name);
    }

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }

  assign(name: Token, value: unknown) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.parent !== null) {
      this.parent.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }
}
