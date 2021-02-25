import { Entity } from "../../src";
import { SpotId } from "../vo/SpotId";
import { Coordinate } from "../vo/Coordinate";

interface Props {
  id: SpotId;
  name: string;
  location?: Coordinate;
  pastLocations?: Coordinate[];
}

const _brand = Symbol();
export class Spot extends Entity<Props> {
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
