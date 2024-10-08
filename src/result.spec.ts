import { BaseError } from "./error";
import { type Result, aggregate, err, fromPromise, ok } from "./result";

class TestError extends BaseError {
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
  // biome-ignore lint/style/noNonNullAssertion:
  return args.error ? err(args.error) : ok(args.value!);
}

describe("Result -> Ok", () => {
  test("can created by ok", () => {
    const actual = getResult({ value: "hoge" });

    expect(actual.isOk()).toBeTruthy();
    expect(actual.isErr()).toBeFalsy();
    // biome-ignore lint/style/noNonNullAssertion:
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
      (err) => err.message,
    );

    expect(actual._ok).toBe(6);
    expect(actual._err).toBeUndefined();
  });

  test("transform value by fold", () => {
    const actual = getResult({ value: 3 }).fold(
      (x) => String(x * 2),
      (err) => err.message,
    );

    expect(actual).toBe("6");
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

  test("get value by unwrap", () => {
    const [actual, error] = getResult({ value: "hoge" }).unwrap();

    expect(actual).toBe("hoge");
    expect(error).toBeUndefined();
  });
});

describe("Result -> Err", () => {
  test("can created by err", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });

    expect(actual.isErr()).toBeTruthy();
    expect(actual.isOk()).toBeFalsy();
    // biome-ignore lint/style/noNonNullAssertion:
    expect(actual._err!.code).toBe("TEST_ERROR");
    // biome-ignore lint/style/noNonNullAssertion:
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
      (err) => err.message,
    );

    expect(actual._err).toBe("失敗の理由: expected");
    expect(actual._ok).toBeUndefined();
  });

  test("transform value by fold", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult<number>({ error }).fold(
      (x: number) => String(x * 2),
      (err) => err.message,
    );

    expect(actual).toBe("失敗の理由: expected");
  });

  test("get alternative value by or", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });
    expect(actual.or("alternative")).toBe("alternative");
  });

  test("get undefined by orUndefined", () => {
    const error = TestError.of({ invalidReason: "expected" });
    const actual = getResult({ error });
    expect(actual.orUndefined()).toBeUndefined();
  });

  test("get error by unwrap", () => {
    const [actual, error] = getResult({
      error: TestError.of({ invalidReason: "expected" }),
    }).unwrap();

    expect(actual).toBeUndefined();
    // biome-ignore lint/style/noNonNullAssertion:
    expect(error!.message).toBe("失敗の理由: expected");
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

  test("can aggregate errors as Err from Error", () => {
    const actual = aggregate([
      getResult<number>({
        error: TestError.of({ invalidReason: "expected1" }),
      }),
      getResult<number>({
        value: 1,
      }),
      getResult<number>({
        error: TestError.of({ invalidReason: "expected3" }),
      }),
    ]);

    if (!actual.isErr()) {
      fail("actual must be Err!");
    }
    expect(actual._ok).toBeUndefined();

    expect(actual.error.length).toBe(2);
    expect(actual.error.map((x) => x.message)).toStrictEqual([
      "失敗の理由: expected1",
      "失敗の理由: expected3",
    ]);
  });
  test("can aggregate errors as Err from Error[]", () => {
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

describe("fromPromise", () => {
  // noinspection NestedFunctionJS
  function asyncOperation(
    a: number,
    b: string,
    occurError: boolean,
  ): Promise<string> {
    return occurError
      ? Promise.reject(new Error("Fail to asyncOperation"))
      : Promise.resolve("Success to asyncOperation");
  }

  test("returns Ok if resolved", async () => {
    const actual = await fromPromise(asyncOperation(1, "2", false));

    if (!actual.isOk()) {
      fail("actual must be Ok!");
    }
    expect(actual._err).toBeUndefined();

    expect(actual.value).toBe("Success to asyncOperation");
  });

  test("returns Err if rejected", async () => {
    const actual = await fromPromise(asyncOperation(1, "2", true));

    if (!actual.isErr()) {
      fail("actual must be Err!");
    }
    expect(actual._ok).toBeUndefined();

    expect(actual.error.message).toBe("Fail to asyncOperation");
  });
});
