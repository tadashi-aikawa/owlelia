import { InvalidSpotIdError } from "../sample/vo/SpotId";
import { BaseError } from "./error";

describe("InvalidSpotIdError", () => {
  test("can be created and not specify stack", () => {
    const invalidErr: BaseError = InvalidSpotIdError.of({
      invalidId: "77777",
    });

    expect(invalidErr.code).toBe("INVALID_SPOT_ID");
    expect(invalidErr.name).toBe("無効なSpotのID");
    expect(invalidErr.message).toBe(
      `SpotのIDは4桁以下でなければいけません。77777は5桁であるため不正値です`
    );
    expect(invalidErr.stack).toBeUndefined;
  });

  test("can be created and specify stack", () => {
    const invalidErr: BaseError = InvalidSpotIdError.of({
      invalidId: "77777",
      stack: "stackmessage",
    });

    expect(invalidErr.code).toBe("INVALID_SPOT_ID");
    expect(invalidErr.name).toBe("無効なSpotのID");
    expect(invalidErr.message).toBe(
      `SpotのIDは4桁以下でなければいけません。77777は5桁であるため不正値です`
    );
    expect(invalidErr.stack).toMatch("無効なSpotのID: SpotのIDは4桁以下でなければいけません。77777は5桁であるため不正値です");
    expect(invalidErr.stack).toMatch("at ");
  });
});
