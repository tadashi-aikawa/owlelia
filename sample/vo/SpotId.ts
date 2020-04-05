import { PrimitiveValueObject } from "../../src";

export class SpotId extends PrimitiveValueObject<string> {
  #voSpotIdBrand!: never;

  static of(value: string): SpotId {
    return new SpotId(value);
  }

  static listOf(values: string[]): SpotId[] {
    return values.map(SpotId.of);
  }
}
