import { Spot } from "../sample/entity/Spot";
import { Coordinate } from "../sample/vo/Coordinate";
import { SpotId } from "../sample/vo/SpotId";

describe("Spot entity", () => {
  let actual: Spot;
  let actualList: Spot[];

  beforeAll(() => {
    actual = Spot.of({
      id: "s1",
      name: "Spot1",
      location: Coordinate.of({ lat: 35, lon: 135 }),
    });
    actualList = Spot.listOf([
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
    ]);
  });

  test("can created by of", () => {
    expect(actual.id).toStrictEqual(SpotId.of("s1"));
  });

  test("can created by listOf", () => {
    expect(actualList.map((x) => x.id)).toStrictEqual(
      SpotId.listOf(["s1", "s2"])
    );
  });

  test("equals the other if entityId are same", () => {
    const sameIdentity = Spot.of({
      id: "s1",
      name: "hoge",
    });

    expect(actual.equals(sameIdentity)).toBeTruthy();
    expect(sameIdentity.equals(actual)).toBeTruthy();
  });

  test("not equals others", () => {
    const sameIdentity = Spot.of({
      id: "s1",
      name: "Spot1",
    });

    expect(actual == sameIdentity).toBeFalsy();
    expect(actual === sameIdentity).toBeFalsy();

    expect(
      actual.equals(
        Spot.of({
          id: "hoge",
          name: "Spot1",
        })
      )
    ).toBeFalsy();
    expect(
      Spot.of({
        id: "hoge",
        name: "Spot1",
      }).equals(actual)
    ).toBeFalsy();

    expect(actual.equals(undefined)).toBeFalsy;
  });

  test("is mutable", () => {
    actual.id = SpotId.of("456");
    expect(actual.id).toStrictEqual(SpotId.of("456"));
  });
});
