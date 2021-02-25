import { aggregate, Result, err, ok } from "./result";
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

function getResult<T, E = TestError>(args: {
  value?: T;
  error?: E;
}): Result<T, E> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return args.error ? err(args.error) : ok(args.value!);
}

describe("Result -> Ok", () => {
  test("can created by ok", () => {
    const actual = getResult({ value: "hoge" });

    expect(actual.isOk()).toBeTruthy();
    expect(actual.isErr()).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actual._ok!).toBe("hoge");
    expect(actual._err).toBeUndefined();
  });

  test("transform value by map", () => {
    const actual = getResult({ value: 3 }).map((x) => x * 2);
    expect(actual._ok).toBe(6);
    expect(actual._err).toBeUndefined();
  });

  test("keep value by mapErr", () => {
    const actual = getResult({ value: 3 }).mapErr((err) => err.message);
    expect(actual._ok).toBe(3);
    expect(actual._err).toBeUndefined();
  });

  test("transform value by biMap", () => {
    const actual = getResult({ value: 3 }).biMap(
      (x) => x * 2,
      (err) => err.message
    );

    expect(actual._ok).toBe(6);
    expect(actual._err).toBeUndefined();
  });

  test("get value by or", () => {
    const actual = getResult({ value: "hoge" });
    expect(actual.or("alternative")).toBe("hoge");
  });

  test("get value by orUndefined", () => {
    const actual = getResult({ value: "hoge" });
    expect(actual.orUndefined()).toBe("hoge");
  });

  test("get value by orNull", () => {
    const actual = getResult({ value: "hoge" });
    expect(actual.orNull()).toBe("hoge");
  });

  test("get value by orThrow", () => {
    const actual = getResult({ value: "hoge" });
    expect(actual.orThrow()).toBe("hoge");
  });
});

describe("Result -> Err", () => {
  test("can created by err", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });

    expect(actual.isErr()).toBeTruthy();
    expect(actual.isOk()).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actual._err!.code).toBe("TEST_ERROR");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actual._err!.message).toBe("失敗の理由: expected");
    expect(actual._ok).toBeUndefined();
  });

  test("transform error by mapErr", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error }).mapErr((err) => err.message);

    expect(actual._err).toBe("失敗の理由: expected");
    expect(actual._ok).toBeUndefined();
  });

  test("keep error by map", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult<number>({ error }).map((x) => x * 2);

    expect(actual._err).toBe(error);
    expect(actual._ok).toBeUndefined();
  });

  test("transform error by biMap", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult<number>({ error }).biMap(
      (x) => x * 2,
      (err) => err.message
    );

    expect(actual._err).toBe("失敗の理由: expected");
    expect(actual._ok).toBeUndefined();
  });

  test("get alternative value by or", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });
    expect(actual.or("alternative")).toBe("alternative");
  });

  test("get undefined by orUndefined", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });
    expect(actual.orUndefined()).toBeUndefined;
  });

  test("get null by orNull", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });
    expect(actual.orNull()).toBeNull();
  });

  test("throw Error by orThrow", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });
    expect(() => {
      actual.orThrow();
    }).toThrow(error);
  });
});

describe("aggregate", () => {
  test("can aggregate values as Ok", () => {
    const actual = aggregate([
      getResult<number, TestError[]>({
        value: 1,
      }),
      getResult<number, TestError[]>({
        value: 2,
      }),
    ]);

    if (!actual.isOk()) {
      fail("actual must be Ok!");
    }
    expect(actual._err).toBeUndefined();

    expect(actual.value.length).toBe(2);
    expect(actual.value).toStrictEqual([1, 2]);
  });

  test("can aggregate errors as Left", () => {
    const actual = aggregate([
      getResult<number, TestError[]>({
        error: TestError.listOf([
          { invalidReason: "expected1" },
          { invalidReason: "expected2" },
        ]),
      }),
      getResult<number, TestError[]>({
        value: 1,
      }),
      getResult<number, TestError[]>({
        error: TestError.listOf([{ invalidReason: "expected3" }]),
      }),
    ]);

    if (!actual.isErr()) {
      fail("actual must be Err!");
    }
    expect(actual._ok).toBeUndefined();

    expect(actual.error.length).toBe(3);
    expect(actual.error.map((x) => x.message)).toStrictEqual([
      "失敗の理由: expected1",
      "失敗の理由: expected2",
      "失敗の理由: expected3",
    ]);
  });
});
