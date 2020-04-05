import { Merge } from "type-fest";
import { Entity } from "../../src";

interface Props {
  id: string;
  name: string;
}

type Args = Merge<Props, { id: number }>;

export class Human extends Entity<Props> {
  #entityHumanBrand!: never;

  static of(args: Args): Human {
    return new Human(args.id, { id: String(args.id), name: args.name });
  }

  static listOf(argsList: Args[]): Human[] {
    return argsList.map(Human.of);
  }

  get id(): string {
    return this._props.id;
  }

  set id(id: string) {
    this._props.id = id;
  }
}
