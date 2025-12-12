import { Entity } from "../../src";
import type { Coordinate } from "../vo/Coordinate";
import type { SpotId } from "../vo/SpotId";

interface Props {
  id: SpotId;
  name: string;
  location?: Coordinate;
  pastLocations?: Coordinate[];
}

const _brand = Symbol();
export class Spot extends Entity<Props> {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
  private [_brand]: void;

  static of(props: Props): Spot {
    return new Spot(props.id.unwrap(), props);
  }

  static listOf(argsList: Props[]): Spot[] {
    return argsList.map(Spot.of);
  }

  get id(): SpotId {
    return this._props.id;
  }

  set id(id: SpotId) {
    this._props.id = id;
  }

  get pastLocations(): Coordinate[] {
    return this._props.pastLocations ?? [];
  }
}
