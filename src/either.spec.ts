import { aggregate, Either, left, right } from "./either";
import { BaseError } from "./error";

export class TestError extends BaseError {
  code = "TEST_ERROR";
  name = "テスト確認用エラー";

  static of(args: { invalidReason: string }): TestError {
    return new TestError(`失敗の理由: ${args.invalidReason}`);
  }

  static listOf(argsList: { invalidReason: string }[]): TestError[] {
    return argsList.map(TestError.of);
  }
}

function getEither<T, E = TestError>(args: {
  error?: E;
  value?: T;
}): Either<E, T> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return args.error ? left(args.error) : right(args.value!);
}

describe("Either -> Right", () => {
  test("can created by right", () => {
    const actual = getEither({ value: "hoge" });

    expect(actual.isRight()).toBeTruthy();
    expect(actual.isLeft()).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actual._right!).toBe("hoge");
    expect(actual._left).toBeUndefined();
  });

  test("transform value by mapRight", () => {
    const actual = getEither({ value: 3 }).mapRight((x) => x * 2);
    expect(actual._right).toBe(6);
    expect(actual._left).toBeUndefined();
  });

  test("keep value by mapLeft", () => {
    const actual = getEither({ value: 3 }).mapLeft((err) => err.message);
    expect(actual._right).toBe(3);
    expect(actual._left).toBeUndefined();
  });

  test("get value by orThrow", () => {
    const actual = getEither({ value: "hoge" });
    expect(actual.orThrow()).toBe("hoge");
  });
});

describe("Either -> Left", () => {
  test("can created by left", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getEither({ error });

    expect(actual.isLeft()).toBeTruthy();
    expect(actual.isRight()).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actual._left!.code).toBe("TEST_ERROR");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actual._left!.message).toBe("失敗の理由: expected");
    expect(actual._right).toBeUndefined();
  });

  test("transform error by mapLeft", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getEither({ error }).mapLeft((err) => err.message);

    expect(actual._left).toBe("失敗の理由: expected");
    expect(actual._right).toBeUndefined();
  });

  test("keep error by mapRight", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getEither<number>({ error }).mapRight((x) => x * 2);

    expect(actual._left).toBe(error);
    expect(actual._right).toBeUndefined();
  });

  test("throw Error by orThrow", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getEither({ error });
    expect(() => {
      actual.orThrow();
    }).toThrow(error);
  });
});

describe("aggregate", () => {
  test("can aggregate values as Right", () => {
    const actual = aggregate([
      getEither<number, TestError[]>({
        value: 1,
      }),
      getEither<number, TestError[]>({
        value: 2,
      }),
    ]);

    if (!actual.isRight()) {
      fail("actual must be Right!");
    }
    expect(actual._left).toBeUndefined();

    expect(actual.value.length).toBe(2);
    expect(actual.value).toStrictEqual([1, 2]);
  });

  test("can aggregate errors as Left", () => {
    const actual = aggregate([
      getEither<number, TestError[]>({
        error: TestError.listOf([
          { invalidReason: "expected1" },
          { invalidReason: "expected2" },
        ]),
      }),
      getEither<number, TestError[]>({
        value: 1,
      }),
      getEither<number, TestError[]>({
        error: TestError.listOf([{ invalidReason: "expected3" }]),
      }),
    ]);

    if (!actual.isLeft()) {
      fail("actual must be Left!");
    }
    expect(actual._right).toBeUndefined();

    expect(actual.error.length).toBe(3);
    expect(actual.error.map((x) => x.message)).toStrictEqual([
      "失敗の理由: expected1",
      "失敗の理由: expected2",
      "失敗の理由: expected3",
    ]);
  });
});
