import { PrimitiveValueObject } from "../../src";
import {
  InvalidSpotIdError,
  SampleError,
  UnexpectedError,
} from "../error/SampleError";
import { aggregate, err, ok, Result } from "../../src/result";

const _brand = Symbol();
export class SpotId extends PrimitiveValueObject<string> {
  private [_brand]: void;

  static try(value: string): Result<SpotId, SampleError[]> {
    return value.length === 0
      ? err([new UnexpectedError("予期せぬエラーが発生")])
      : value.length > 4
      ? err([
          new InvalidSpotIdError(
            `SpotのIDは4桁以下でなければいけません。${value}は${value.length}桁であるため不正値です`
          ),
        ])
      : ok(new SpotId(value));
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
