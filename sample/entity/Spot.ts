import { Entity } from "../../src";
import { SpotId } from "../vo/SpotId";
import { Coordinate } from "../vo/Coordinate";

interface Props {
  id: SpotId;
  name: string;
  location?: Coordinate;
  pastLocations?: Coordinate[];
}

type Args = Props;

export class Spot extends Entity<Props> {
  _entitySpotBrand!: never;

  static of(args: Args): Spot {
    return new Spot(args.id.unwrap(), {
      id: args.id,
      name: args.name,
      location: args.location,
      pastLocations: args.pastLocations,
    });
  }

  static listOf(argsList: Args[]): Spot[] {
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
