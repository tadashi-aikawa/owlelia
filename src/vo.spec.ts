import { Human } from "../sample/vo/Human";
import { ClassName } from "../sample/vo/ClassName";
import { ClassRoom } from "../sample/vo/ClassRoom";

describe("ClassName primitive vo", () => {
  let actual: ClassName;
  let actualList: ClassName[];

  beforeAll(() => {
    actual = ClassName.of("1-1");
    actualList = ClassName.listOf(["1-1", "2-2"]);
  });

  test("can created by of", () => {
    expect(actual.value).toBe("1-1");
  });

  test("can created by listOf", () => {
    expect(actualList.map((x) => x.value)).toStrictEqual(["1-1", "2-2"]);
  });

  test("equals the other", () => {
    expect(actual.equals(ClassName.of("1-1"))).toBeTruthy();
    expect(ClassName.of("1-1").equals(actual)).toBeTruthy();

    expect(actualList).toStrictEqual(ClassName.listOf(["1-1", "2-2"]));
  });

  test("not equals others", () => {
    expect(actual == ClassName.of("1-1")).toBeFalsy();
    expect(actual === ClassName.of("1-1")).toBeFalsy();
    expect(actual.equals(ClassName.of("1-2"))).toBeFalsy();

    expect(actualList == ClassName.listOf(["1-1", "2-2"])).toBeFalsy();
    expect(actualList === ClassName.listOf(["1-1", "2-2"])).toBeFalsy();
  });
});

describe("Human simple vo", () => {
  let actual: Human;

  beforeAll(() => {
    actual = Human.of({ id: 100, name: "Hundred" });
  });

  test("can created by of", () => {
    expect(actual.id).toBe("100");
  });

  test("allow minimum access", () => {
    expect(actual).toHaveProperty("id");
    expect(actual).not.toHaveProperty("name");
  });

  test("equals the other", () => {
    expect(actual.equals(Human.of({ id: 100, name: "Hundred" }))).toBeTruthy();
    expect(Human.of({ id: 100, name: "Hundred" }).equals(actual)).toBeTruthy();
  });

  test("not equals others", () => {
    expect(actual == Human.of({ id: 100, name: "Hundred" })).not.toBeTruthy();
    expect(actual === Human.of({ id: 100, name: "Hundred" })).not.toBeTruthy();
    expect(actual.equals(Human.of({ id: 100, name: "hoge" }))).not.toBeTruthy();
    expect(
      actual.equals(Human.of({ id: 1, name: "Hundred" }))
    ).not.toBeTruthy();
  });

  test("is immutable", () => {
    expect(() => {
      actual.id = "1234567";
    }).toThrowError(
      "Cannot assign to read only property 'id' of object '#<Object>'"
    );
  });
});

describe("ClassRoom vo", () => {
  let actualRequired: ClassRoom;
  let actualOptional: ClassRoom;

  let otherRequired: ClassRoom;
  let otherOptional: ClassRoom;

  beforeAll(() => {
    actualRequired = ClassRoom.of({
      students: Human.listOf([
        { id: 1, name: "One" },
        { id: 2, name: "Two" },
      ]),
      name: "1-1 Required",
      otherName: "1-1R",
      pastNames: ["0-9", "1-0"],
    });

    actualOptional = ClassRoom.of({
      students: Human.listOf([{ id: 1, name: "One" }]),
      pastNames: [],
    });

    otherRequired = ClassRoom.of({
      students: Human.listOf([
        { id: 1, name: "One" },
        { id: 2, name: "Two" },
      ]),
      name: "1-1 Required",
      otherName: "1-1R",
      pastNames: ["0-9", "1-0"],
    });

    otherOptional = ClassRoom.of({
      students: Human.listOf([{ id: 1, name: "One" }]),
      pastNames: [],
    });
  });

  test("can created by of", () => {
    expect(actualRequired.studentIds).toStrictEqual(["1", "2"]);
    expect(actualRequired.name.value).toBe("1-1 Required");
    expect(actualRequired.otherName?.value).toBe("1-1R");

    expect(actualOptional.studentIds).toStrictEqual(["1"]);
    expect(actualOptional.name.value).toBe("0-0");
    expect(actualOptional.otherName).toBeUndefined();
  });

  test("equals the other", () => {
    expect(actualRequired.equals(otherRequired)).toBeTruthy();
    expect(actualOptional.equals(otherOptional)).toBeTruthy();
  });

  test("not equals others", () => {
    expect(actualRequired == otherRequired).toBeFalsy();
    expect(actualRequired === otherRequired).toBeFalsy();
    expect(actualOptional == otherOptional).toBeFalsy();
    expect(actualOptional === otherOptional).toBeFalsy();
  });

  test("is immutable", () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      actualRequired.name = "1234567";
    }).toThrowError(
      "Cannot set property name of #<ClassRoom> which has only a getter"
    );
  });
});
