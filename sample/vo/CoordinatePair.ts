import { ValueObject } from "../../src";
import { Coordinate } from "./Coordinate";

interface Props {
  one: Coordinate;
  other: Coordinate;
}

const _brand = Symbol();
export class CoordinatePair extends ValueObject<Props> {
  private [_brand]: void;

  static of(props: Props): CoordinatePair {
    return new CoordinatePair(props);
  }

  get displayString(): string {
    return `(${this._value.one.displayString}),(${this._value.other.displayString})`;
  }
}
