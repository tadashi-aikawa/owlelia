import { PrimitiveValueObject } from "../../src";
import { SampleError } from "../error/SampleError";
import { aggregate, Either, right, left } from "../../src/either";

export class InvalidSpotIdError extends SampleError {
  code = "INVALID_SPOT_ID";
  name = "無効なSpotのID";

  static of(args: { invalidId: string; stack?: string }): InvalidSpotIdError {
    return new InvalidSpotIdError(
      `SpotのIDは4桁以下でなければいけません。${args.invalidId}は${args.invalidId.length}桁であるため不正値です`
    );
  }
}

export class SpotId extends PrimitiveValueObject<string> {
  _voSpotIdBrand!: never;

  static try(value: string): Either<SampleError[], SpotId> {
    return value.length <= 4
      ? right(new SpotId(value))
      : left([InvalidSpotIdError.of({ invalidId: value })]);
  }

  static of(value: string): SpotId {
    return SpotId.try(value).orThrow();
  }

  static listTry(values: string[]): Either<SampleError[], SpotId[]> {
    return aggregate(values.map(SpotId.try));
  }

  static listOf(values: string[]): SpotId[] {
    return values.map(SpotId.of);
  }
}
