import { BaseError } from "./error";
import { Entity } from "./entity";

type ErrorCode = "a" | "b";

class ConcreteError extends BaseError {
  code: ErrorCode = "a";

  static of(args: { name: string; message: string }): ConcreteError {
    return new ConcreteError(args.name, args.message);
  }
}
