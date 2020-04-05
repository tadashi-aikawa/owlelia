import { ValueObject } from "../../src";

interface Props {
  lat: number;
  lon: number;
}

type Args = Props;

export class Coordinate extends ValueObject<Props> {
  #voCoordinateBrand!: never;

  static of(args: Args): Coordinate {
    return new Coordinate({ lat: args.lat, lon: args.lon });
  }

  get displayString(): string {
    return `${this._value.lat},${this._value.lon}`;
  }
}
