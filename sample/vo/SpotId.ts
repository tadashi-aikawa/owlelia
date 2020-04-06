import { Either, left, right } from "fp-ts/lib/Either";
import { PrimitiveValueObject } from "../../src";
import { SampleError } from "../error/SampleError";
import { foldEithers } from "../utils";

export class InvalidSpotIdError extends SampleError {
  code = "INVALID_SPOT_ID";
  name = "無効なSpotのID";

  static of(args: { invalidId: string; stack?: string }): InvalidSpotIdError {
    return new InvalidSpotIdError(
      `SpotのIDは4桁以下でなければいけません。${args.invalidId}は${args.invalidId.length}桁であるため不正値です`,
      args.stack
    );
  }
}

export class SpotId extends PrimitiveValueObject<string> {
  #voSpotIdBrand!: never;

  static of(value: string): Either<SampleError[], SpotId> {
    return value.length <= 4
      ? right(new SpotId(value))
      : left([InvalidSpotIdError.of({ invalidId: value })]);
  }

  static listOf(values: string[]): Either<SampleError[], SpotId[]> {
    return foldEithers(values.map(SpotId.of));
  }
}
