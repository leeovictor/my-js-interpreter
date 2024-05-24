import { RuntimeError } from "./RuntimeError";
import { Token } from "./Token";

export class Environment {
  private values = new Map<string, unknown>();

  define(name: string, value: unknown) {
    this.values.set(name, value);
  }

  get(name: Token) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }
}
