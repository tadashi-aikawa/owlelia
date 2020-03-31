export abstract class BaseError {
  abstract code: string;
  abstract name: string;
  message: string;
  stack?: string;

  protected constructor(message: string, stack?: string) {
    this.message = message;
    this.stack = stack;
  }
}

export type MaybeError = BaseError | undefined;
