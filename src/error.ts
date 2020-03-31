export abstract class BaseError {
  abstract code: string;
  name: string;
  message: string;
  stack?: string;

  protected constructor(name: string, message: string, stack?: string) {
    this.name = name;
    this.message = message;
    this.stack = stack;
  }
}

export type MaybeError = BaseError | undefined;
