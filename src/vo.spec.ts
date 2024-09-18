import { SpotId } from "../sample/vo/SpotId";
import { Animal } from "../sample/vo/Animal";
import { CoordinatePair } from "../sample/vo/CoordinatePair";
import { Coordinate } from "../sample/vo/Coordinate";
import { AnimalName } from "../sample/vo/AnimalName";

describe("Primitive VO(SpotId)", () => {
  let actual: SpotId;
  let actualList: SpotId[];

  beforeAll(() => {
    actual = SpotId.of("100");
    actualList = SpotId.listOf(["100", "200"]);
  });

  test("can created by of", () => {
    expect(actual.unwrap()).toBe("100");
  });

  test("can created by listOf", () => {
    expect(actualList.map((x) => x.unwrap())).toStrictEqual(["100", "200"]);
  });

  test("equals the other", () => {
    const sameValue = SpotId.of("100");
    expect(actual.equals(sameValue)).toBeTruthy();
    expect(sameValue.equals(actual)).toBeTruthy();

    const sameValueList = SpotId.listOf(["100", "200"]);
    expect(actualList).toStrictEqual(sameValueList);
  });

  test("not equals others", () => {
    const sameValue = SpotId.of("100");
    expect(actual == sameValue).toBeFalsy();
    expect(actual === sameValue).toBeFalsy();
    expect(actual.equals(SpotId.of("101"))).toBeFalsy();
    expect(actual.equals(undefined)).toBeFalsy();

    const sameValueList = SpotId.listOf(["100", "200"]);
    expect(actualList == sameValueList).toBeFalsy();
    expect(actualList === sameValueList).toBeFalsy();
  });

  test("has invalid spotId", () => {
    const actual = SpotId.try("1234567");
    if (!actual.isErr()) {
      fail("actual must be Err!");
    }

    expect(actual.error.length).toBe(1);
    expect(actual.error[0].name).toBe("InvalidSpotIdError");
  });

  test("has invalid spotIds", () => {
    const actual = SpotId.listTry(["123", "12345", "1234567"]);
    if (!actual.isErr()) {
      fail("actual must be Err!");
    }

    expect(actual.error.length).toBe(2);
    expect(actual.error.map((x) => x.message)).toStrictEqual([
      "SpotのIDは4桁以下でなければいけません。12345は5桁であるため不正値です",
      "SpotのIDは4桁以下でなければいけません。1234567は7桁であるため不正値です",
    ]);
  });
});

describe("Simple VO(Animal)", () => {
  let actual: Animal;

  beforeAll(() => {
    actual = Animal.of({ kind: "dog", name: "momochi" as AnimalName });
  });

  test("can created by of", () => {
    expect(actual.kind).toBe("dog");
  });

  test("allow minimum access", () => {
    expect(actual).toHaveProperty("kind");
    expect(actual).not.toHaveProperty("name");
  });

  test("equals the other", () => {
    expect(
      actual.equals(Animal.of({ kind: "dog", name: "momochi" as AnimalName })),
    ).toBeTruthy();
    expect(
      Animal.of({ kind: "dog", name: "momochi" as AnimalName }).equals(actual),
    ).toBeTruthy();
  });

  test("not equals others", () => {
    expect(
      actual == Animal.of({ kind: "dog", name: "momochi" as AnimalName }),
    ).not.toBeTruthy();
    expect(
      actual === Animal.of({ kind: "dog", name: "momochi" as AnimalName }),
    ).not.toBeTruthy();
    expect(
      actual.equals(Animal.of({ kind: "cat", name: "momochi" as AnimalName })),
    ).not.toBeTruthy();
    expect(
      actual.equals(Animal.of({ kind: "dog", name: "tatsuwo" as AnimalName })),
    ).not.toBeTruthy();
  });

  test("is immutable", () => {
    expect(() => {
      actual.kind = "cow";
    }).toThrowError(
      "Cannot assign to read only property 'kind' of object '#<Object>'",
    );
  });
});

describe("VO in VO(CoordinatePair)", () => {
  let actual: CoordinatePair;

  beforeAll(() => {
    actual = CoordinatePair.of({
      one: Coordinate.of({ lat: 35, lon: 135 }),
      other: Coordinate.of({ lat: 36, lon: 136 }),
    });
  });

  test("can created by of", () => {
    expect(actual.displayString).toBe("(35,135),(36,136)");
  });

  test("equals the other", () => {
    const sameValue = CoordinatePair.of({
      one: Coordinate.of({ lat: 35, lon: 135 }),
      other: Coordinate.of({ lat: 36, lon: 136 }),
    });

    expect(actual.equals(sameValue)).toBeTruthy();
    expect(sameValue.equals(actual)).toBeTruthy();
  });

  test("not equals others", () => {
    const sameValue = CoordinatePair.of({
      one: Coordinate.of({ lat: 35, lon: 135 }),
      other: Coordinate.of({ lat: 36, lon: 136 }),
    });

    expect(actual == sameValue).not.toBeTruthy();
    expect(actual === sameValue).not.toBeTruthy();
  });
});
