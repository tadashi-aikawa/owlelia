import { PrimitiveValueObject } from "../../src/vo";

export class ClassName extends PrimitiveValueObject<string> {
  #voClassNameBrand!: never;

  static of(value: string): ClassName {
    return new ClassName(value);
  }

  static listOf(values: string[]): ClassName[] {
    return values.map(ClassName.of);
  }
}
