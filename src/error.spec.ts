import { InvalidHumanIdError } from "../sample/error/InvalidHumanIdError";
import { BaseError } from "./error";

describe("InvalidHumanIdError", () => {
  test("can be created and not specify stack", () => {
    const invalidErr: BaseError = InvalidHumanIdError.of({
      message: "invalid err!",
    });

    expect(invalidErr.code).toBe("INVALID_HUMAN_ID");
    expect(invalidErr.name).toBe("無効なHumanのID");
    expect(invalidErr.message).toBe("invalid err!");
    expect(invalidErr.stack).toBeUndefined;
  });

  test("can be created and specify stack", () => {
    const invalidErr: BaseError = InvalidHumanIdError.of({
      message: "invalid err!",
      stack: "error stack",
    });

    expect(invalidErr.code).toBe("INVALID_HUMAN_ID");
    expect(invalidErr.name).toBe("無効なHumanのID");
    expect(invalidErr.message).toBe("invalid err!");
    expect(invalidErr.stack).toBe("error stack");
  });
});
