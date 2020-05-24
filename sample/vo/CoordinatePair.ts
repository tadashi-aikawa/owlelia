import { ValueObject } from "../../src";
import { Coordinate } from "./Coordinate";

interface Props {
  one: Coordinate;
  other: Coordinate;
}

type Args = Props;

export class CoordinatePair extends ValueObject<Props> {
  _voCoordinatePairBrand!: never;

  static of(args: Args): CoordinatePair {
    return new CoordinatePair({
      one: args.one,
      other: args.other,
    });
  }

  get displayString(): string {
    return `(${this._value.one.displayString}),(${this._value.other.displayString})`;
  }
}
