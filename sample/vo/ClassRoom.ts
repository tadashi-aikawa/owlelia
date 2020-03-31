import { Merge } from "type-fest";
import { ValueObject } from "../../src/vo";
import { ClassName } from "./ClassName";
import { Human } from "./Human";

interface Props {
  students: Human[];
  name: ClassName;
  otherName?: ClassName;
  pastNames: ClassName[];
}

type Args = Merge<
  Props,
  { name?: string; otherName?: string; pastNames: string[] }
>;

export class ClassRoom extends ValueObject<Props> {
  _ClassRoomBrand!: never;

  static of(args: Args): ClassRoom {
    return new ClassRoom({
      students: args.students,
      name: ClassName.of(args.name ?? "0-0"),
      otherName: args.otherName ? ClassName.of(args.otherName) : undefined,
      pastNames: ClassName.listOf(args.pastNames),
    });
  }

  get name(): ClassName {
    return this._value.name;
  }

  get otherName(): ClassName | undefined {
    return this._value.otherName;
  }

  get studentIds(): string[] {
    return this._value.students.map((x) => x.id);
  }
}
