import { ValueObject } from "../../src";

interface Props {
  lat: number;
  lon: number;
}

type Args = Props;

export class Coordinate extends ValueObject<Props> {
  _voCoordinateBrand!: never;

  static of(args: Args): Coordinate {
    return new Coordinate({ lat: args.lat, lon: args.lon });
  }

  static listOf(argsList: Args[]): Coordinate[] {
    return argsList.map(Coordinate.of);
  }

  get displayString(): string {
    return `${this._value.lat},${this._value.lon}`;
  }
}
