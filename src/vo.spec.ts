import { SpotId } from "../sample/vo/SpotId";
import { Animal } from "../sample/vo/Animal";
import { CoordinatePair } from "../sample/vo/CoordinatePair";
import { Coordinate } from "../sample/vo/Coordinate";

describe("Primitive VO(SpotId)", () => {
  let actual: SpotId;
  let actualList: SpotId[];

  beforeAll(() => {
    actual = SpotId.of("100");
    actualList = SpotId.listOf(["100", "200"]);
  });

  test("can created by of", () => {
    expect(actual.value).toBe("100");
  });

  test("can created by listOf", () => {
    expect(actualList.map((x) => x.value)).toStrictEqual(["100", "200"]);
  });

  test("equals the other", () => {
    expect(actual.equals(SpotId.of("100"))).toBeTruthy();
    expect(SpotId.of("100").equals(actual)).toBeTruthy();

    expect(actualList).toStrictEqual(SpotId.listOf(["100", "200"]));
  });

  test("not equals others", () => {
    expect(actual == SpotId.of("100")).toBeFalsy();
    expect(actual === SpotId.of("100")).toBeFalsy();
    expect(actual.equals(SpotId.of("101"))).toBeFalsy();
    expect(actual.equals(undefined)).toBeFalsy();

    expect(actualList == SpotId.listOf(["100", "200"])).toBeFalsy();
    expect(actualList === SpotId.listOf(["100", "200"])).toBeFalsy();
  });
});

describe("Simple VO(Animal)", () => {
  let actual: Animal;

  beforeAll(() => {
    actual = Animal.of({ kind: "dog", name: "momochi" });
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
      actual.equals(Animal.of({ kind: "dog", name: "momochi" }))
    ).toBeTruthy();
    expect(
      Animal.of({ kind: "dog", name: "momochi" }).equals(actual)
    ).toBeTruthy();
  });

  test("not equals others", () => {
    expect(
      actual == Animal.of({ kind: "dog", name: "momochi" })
    ).not.toBeTruthy();
    expect(
      actual === Animal.of({ kind: "dog", name: "momochi" })
    ).not.toBeTruthy();
    expect(
      actual.equals(Animal.of({ kind: "cat", name: "momochi" }))
    ).not.toBeTruthy();
    expect(
      actual.equals(Animal.of({ kind: "dog", name: "tatsuwo" }))
    ).not.toBeTruthy();
  });

  test("is immutable", () => {
    expect(() => {
      actual.kind = "cow";
    }).toThrowError(
      "Cannot assign to read only property 'kind' of object '#<Object>'"
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
