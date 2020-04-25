import { pipe } from "fp-ts/lib/pipeable";
import { Merge } from "type-fest";
import { Entity } from "../../src";
import { SpotId } from "../vo/SpotId";
import { Coordinate } from "../vo/Coordinate";
import { Either, map } from "fp-ts/lib/Either";
import { foldEithers } from "../utils";
import { SampleError } from "../error/SampleError";
import {monadThrow} from "fp-ts";

interface Props {
  id: SpotId;
  name: string;
  location?: Coordinate;
  pastLocations?: Coordinate[];
}

type Args = Merge<Props, { id: string }>;

export class Spot extends Entity<Props> {
  #entitySpotBrand!: never;

  static of(args: Args): Either<SampleError[], Spot> {
    return pipe(
      SpotId.of(args.id),
      map(
        (spotId: SpotId) =>
          new Spot(args.id, {
            id: spotId,
            name: args.name,
            location: args.location,
            pastLocations: args.pastLocations,
          })
      ),
    );
  }

  static listOf(argsList: Args[]): Either<SampleError[], Spot[]> {
    return foldEithers(argsList.map(Spot.of));
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
