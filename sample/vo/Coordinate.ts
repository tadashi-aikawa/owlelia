import { ValueObject } from "../../src";

interface Props {
  lat: number;
  lon: number;
}

const _brand = Symbol();
export class Coordinate extends ValueObject<Props> {
  private [_brand]: void;

  static of(props: Props): Coordinate {
    return new Coordinate(props);
  }

  static listOf(propsList: Props[]): Coordinate[] {
    return propsList.map(Coordinate.of);
  }

  get displayString(): string {
    return `${this._value.lat},${this._value.lon}`;
  }
}
