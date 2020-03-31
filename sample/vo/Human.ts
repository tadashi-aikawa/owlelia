import { Merge } from "type-fest";
import { ValueObject } from "../../src/vo";

interface Props {
  id: string;
  name: string;
}

type Args = Merge<Props, { id: number }>;

export class Human extends ValueObject<Props> {
  _HumanBrand!: never;

  static of(args: Args): Human {
    return new Human({ id: String(args.id), name: args.name });
  }

  static listOf(argsList: Args[]): Human[] {
    return argsList.map(Human.of);
  }

  get id(): string {
    return this._value.id;
  }
}
