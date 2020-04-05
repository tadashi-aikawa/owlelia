import { Merge } from "type-fest";
import { ValueObject } from "../../src";

interface Props {
  id: string;
  name: string;
}

type Args = Merge<Props, { id: number }>;

export class Human extends ValueObject<Props> {
  #voHumanBrand!: never;

  static of(args: Args): Human {
    return new Human({ id: String(args.id), name: args.name });
  }

  static listOf(argsList: Args[]): Human[] {
    return argsList.map(Human.of);
  }

  get id(): string {
    return this._value.id;
  }

  // Only for test. Remove this in production codes.
  set id(id: string) {
    this._value.id = id;
  }
}
