import { ValueObject } from "../../src";

interface Props {
  lat: number;
  lon: number;
}

const _brand = Symbol();
export class Coordinate extends ValueObject<Props> {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
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
