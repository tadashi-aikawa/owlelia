import { PrimitiveValueObject } from "../../src";
import { aggregate, err, ok, type Result } from "../../src/result";
import {
  InvalidSpotIdError,
  type SampleError,
  UnexpectedError,
} from "../error/SampleError";

const _brand = Symbol();
export class SpotId extends PrimitiveValueObject<string> {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
  private [_brand]: void;

  static try(value: string): Result<SpotId, SampleError[]> {
    return value.length === 0
      ? err([new UnexpectedError("予期せぬエラーが発生")])
      : value.length > 4
        ? err([
            new InvalidSpotIdError(
              `SpotのIDは4桁以下でなければいけません。${value}は${value.length}桁であるため不正値です`,
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
