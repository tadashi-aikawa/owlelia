import {
  InvalidSpotIdError,
  SampleError,
  UnexpectedError,
} from "../sample/error/SampleError";

describe("InvalidSpotIdError", () => {
  test("can be created and not specify stack", () => {
    const invalidErr = new InvalidSpotIdError("無効なStopのIDです");

    expect(invalidErr.name).toBe("InvalidSpotIdError");
    expect(invalidErr.message).toBe("無効なStopのIDです");
    expect(invalidErr.stack).toBeUndefined;
  });
});

describe("UnexpectedError", () => {
  test("can be created and not specify stack", () => {
    const sampleError: SampleError = new UnexpectedError("予期せぬエラーです");

    expect(sampleError.name).toBe("UnexpectedError");
    expect(sampleError.message).toBe("予期せぬエラーです");
    expect(sampleError.stack).toBeUndefined;
  });
});

describe("BaseError.to", () => {
  test("can create a new Error instance from another", () => {
    const unexpected = new UnexpectedError("オリジナルのエラーメッセージ");
    const invalid = unexpected.to(InvalidSpotIdError);

    expect(invalid.name).toBe("InvalidSpotIdError");
    expect(invalid.message).toBe("オリジナルのエラーメッセージ");
    expect(invalid.stack).toBeUndefined;
  });
});
