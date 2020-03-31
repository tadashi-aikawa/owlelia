import { BaseError } from "../../src/error";

export class InvalidHumanIdError extends BaseError {
  code: ErrorCode = "INVALID_HUMAN_ID";
  name = "無効なHumanのID";

  static of(args: { message: string; stack?: string }): InvalidHumanIdError {
    return new InvalidHumanIdError(args.message, args.stack);
  }
}