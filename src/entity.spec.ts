import { Spot } from "../sample/entity/Spot";
import { Coordinate } from "../sample/vo/Coordinate";
import { SpotId } from "../sample/vo/SpotId";
import { Either, fold, right } from "fp-ts/lib/Either";
import { SampleError } from "../sample/error/SampleError";
import { forceRight } from "../sample/utils";

describe("Spot entity", () => {
  let actual: Spot;
  let actualList: Spot[];

  beforeAll(() => {
    actual = forceRight(
      Spot.of({
        id: "s1",
        name: "Spot1",
        location: Coordinate.of({ lat: 35, lon: 135 }),
      })
    );
    actualList = forceRight(
      Spot.listOf([
        {
          id: "s1",
          name: "Spot1",
          location: Coordinate.of({ lat: 35, lon: 135 }),
        },
        {
          id: "s2",
          name: "Spot2",
          pastLocations: [Coordinate.of({ lat: 36, lon: 136 })],
        },
      ])
    );
  });

  test("can created by of", () => {
    expect(actual.id).toStrictEqual(forceRight(SpotId.of("s1")));
  });

  test("can created by listOf", () => {
    expect(actualList.map((x) => x.id)).toStrictEqual(
      forceRight(SpotId.listOf(["s1", "s2"]))
    );
  });

  test("equals the other if entityId are same", () => {
    const sameIdentity = forceRight(
      Spot.of({
        id: "s1",
        name: "hoge",
      })
    );

    expect(actual.equals(sameIdentity)).toBeTruthy();
    expect(sameIdentity.equals(actual)).toBeTruthy();
  });

  test("not equals others", () => {
    const sameIdentity = forceRight(
      Spot.of({
        id: "s1",
        name: "Spot1",
      })
    );

    expect(actual == sameIdentity).toBeFalsy();
    expect(actual === sameIdentity).toBeFalsy();

    expect(
      actual.equals(
        forceRight(
          Spot.of({
            id: "hoge",
            name: "Spot1",
          })
        )
      )
    ).toBeFalsy();
    expect(
      forceRight(
        Spot.of({
          id: "hoge",
          name: "Spot1",
        })
      ).equals(actual)
    ).toBeFalsy();

    expect(actual.equals(undefined)).toBeFalsy;
  });

  test("is mutable", () => {
    actual.id = forceRight(SpotId.of("456"));
    expect(actual.id).toStrictEqual(forceRight(SpotId.of("456")));
  });
});
