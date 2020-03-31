import { Human } from "../sample/entity/Human";

describe("Human entity", () => {
  let actual: Human;
  let actualList: Human[];

  beforeAll(() => {
    actual = Human.of({
      id: 1,
      name: "One",
    });
    actualList = Human.listOf([
      { id: 1, name: "One" },
      { id: 2, name: "Two" },
    ]);
  });

  test("can created by of", () => {
    expect(actual.id).toBe("1");
  });

  test("can created by listOf", () => {
    expect(actualList.map((x) => x.id)).toStrictEqual(["1", "2"]);
  });

  test("equals the other if entityId are same", () => {
    expect(actual.equals(Human.of({ id: 1, name: "Two" }))).toBeTruthy();
    expect(Human.of({ id: 1, name: "Two" }).equals(actual)).toBeTruthy();

    expect(actualList).toStrictEqual(
      Human.listOf([
        { id: 1, name: "One" },
        { id: 2, name: "Two" },
      ])
    );
  });

  test("not equals others", () => {
    expect(actual == Human.of({ id: 1, name: "Two" })).toBeFalsy();
    expect(actual === Human.of({ id: 1, name: "Two" })).toBeFalsy();

    expect(actual.equals(Human.of({ id: 2, name: "One" }))).toBeFalsy();
    expect(Human.of({ id: 2, name: "One" }).equals(actual)).toBeFalsy();
  });

  test("is mutable", () => {
    actual.id = "456";
    expect(actual.id).toBe("456");
  });
});
