import { ValueObject } from "../../src";
import type { AnimalName } from "./AnimalName";

interface Props {
  kind: string;
  name: AnimalName;
}

const _brand = Symbol();
export class Animal extends ValueObject<Props> {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
  private [_brand]: void;

  static of(props: Props): Animal {
    return new Animal(props);
  }

  get kind(): string {
    return this._value.kind;
  }

  // Only for test. Remove this in production codes.
  set kind(kind: string) {
    this._value.kind = kind;
  }
}
