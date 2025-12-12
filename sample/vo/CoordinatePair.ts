import { ValueObject } from "../../src";
import type { Coordinate } from "./Coordinate";

interface Props {
  one: Coordinate;
  other: Coordinate;
}

const _brand = Symbol();
export class CoordinatePair extends ValueObject<Props> {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
  private [_brand]: void;

  static of(props: Props): CoordinatePair {
    return new CoordinatePair(props);
  }

  get displayString(): string {
    return `(${this._value.one.displayString}),(${this._value.other.displayString})`;
  }
}
