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

export class UnexpectedLeftError extends BaseError {
  code = "UNEXPECTED_LEFT_ERROR";
  name = "Unexpected Left Error";

  static of<E>(args: { left: E; stack?: string }): UnexpectedLeftError {
    return new UnexpectedLeftError(
      `Right is expected but Left!!
Check if there are any mistakes in the implementation :(

Left is below.

${JSON.stringify(args.left, null, 4)}`,
      args.stack
    );
  }
}
