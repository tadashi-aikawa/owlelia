import { Merge } from "type-fest";
import { ValueObject } from "../../src";

interface Props {
  kind: string;
  name: string;
}

type Args = Merge<Props, { kind?: string }>;

export class Animal extends ValueObject<Props> {
  #voAnimalBrand!: never;

  static of(args: Args): Animal {
    return new Animal({ kind: args.kind ?? "unknown", name: args.name });
  }

  get kind(): string {
    return this._value.kind;
  }

  // Only for test. Remove this in production codes.
  set kind(kind: string) {
    this._value.kind = kind;
  }
}
