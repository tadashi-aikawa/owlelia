import { Merge } from "type-fest";
import { ValueObject } from "../../src/vo";

interface Props {
  id: string;
  name: string;
}

type Args = Merge<Props, { id: number }>;

// There are same properties with Human
export class Animal extends ValueObject<Props> {
  _AnimalBrand!: never;

  static of(args: Args): Animal {
    return new Animal({ id: String(args.id), name: args.name });
  }

  get id(): string {
    return this._value.id;
  }
}
