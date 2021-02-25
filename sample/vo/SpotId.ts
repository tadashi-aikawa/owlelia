import { PrimitiveValueObject } from "../../src";
import { SampleError } from "../error/SampleError";
import { aggregate, Result, ok, err } from "../../src/result";

export class InvalidSpotIdError extends SampleError {
  code = "INVALID_SPOT_ID";
  name = "無効なSpotのID";

  static of(args: { invalidId: string; stack?: string }): InvalidSpotIdError {
    return new InvalidSpotIdError(
      `SpotのIDは4桁以下でなければいけません。${args.invalidId}は${args.invalidId.length}桁であるため不正値です`
    );
  }
}

const _brand = Symbol();
export class SpotId extends PrimitiveValueObject<string> {
  private [_brand]: void;

  static try(value: string): Result<SpotId, SampleError[]> {
    return value.length <= 4
      ? ok(new SpotId(value))
      : err([InvalidSpotIdError.of({ invalidId: value })]);
  }

  static of(value: string): SpotId {
    return SpotId.try(value).orThrow();
  }

  static listTry(values: string[]): Result<SpotId[], SampleError[]> {
    return aggregate(values.map(SpotId.try));
  }

  static listOf(values: string[]): SpotId[] {
    return values.map(SpotId.of);
  }
}
