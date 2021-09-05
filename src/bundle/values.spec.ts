import { LiquidValue } from "./values";
import { err, ok } from "../result";
import { BaseError } from "../error";

function expectLiquidValue(
  v: LiquidValue<string>,
  value: string,
  loading: boolean,
  errorMessage?: string
) {
  expect(v.value).toBe(value);
  expect(v.loading).toBe(loading);
  expect(v.error?.message).toBe(errorMessage);
}

describe("LiquidValue", () => {
  describe("empty", () => {
    test("Initial is empty", async () => {
      const v = new LiquidValue<string>("");
      expect(v.isEmpty()).toBeTruthy();
    });
    test("Not empty", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));
      expect(v.isEmpty()).toBeFalsy();
    });
    test("Still empty", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));
      expect(v.isEmpty()).toBeTruthy();
    });
  });

  describe("default option", () => {
    test("init -> success", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => ok("ok"));
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("init -> error", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => err(new BaseError("error")));
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("success -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => ok("ok2"));
      expectLiquidValue(v, "ok", true);
      await promise;
      expectLiquidValue(v, "ok2", false);
    });

    test("success -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => err(new BaseError("error")));
      expectLiquidValue(v, "ok", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("error -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => ok("ok"));
      expectLiquidValue(v, "", true, "error");
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("error -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => err(new BaseError("error2")));
      expectLiquidValue(v, "", true, "error");
      await promise;
      expectLiquidValue(v, "", false, "error2");
    });
  });

  describe("silent", () => {
    test("init -> success", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => ok("ok"), {
        silent: true,
      });
      expectLiquidValue(v, "", false);
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("init -> error", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => err(new BaseError("error")), {
        silent: true,
      });
      expectLiquidValue(v, "", false);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("success -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => ok("ok2"), {
        silent: true,
      });
      expectLiquidValue(v, "ok", false);
      await promise;
      expectLiquidValue(v, "ok2", false);
    });

    test("success -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => err(new BaseError("error")), {
        silent: true,
      });
      expectLiquidValue(v, "ok", false);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("error -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => ok("ok"), {
        silent: true,
      });
      expectLiquidValue(v, "", false, "error");
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("error -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => err(new BaseError("error2")), {
        silent: true,
      });
      expectLiquidValue(v, "", false, "error");
      await promise;
      expectLiquidValue(v, "", false, "error2");
    });
  });

  describe("clearValueBeforeLoading", () => {
    test("init -> success", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => ok("ok"), {
        clearValueBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("init -> error", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => err(new BaseError("error")), {
        clearValueBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("success -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => ok("ok2"), {
        clearValueBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "ok2", false);
    });

    test("success -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => err(new BaseError("error")), {
        clearValueBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("error -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => ok("ok"), {
        clearValueBeforeLoading: true,
      });
      expectLiquidValue(v, "", true, "error");
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("error -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => err(new BaseError("error2")), {
        clearValueBeforeLoading: true,
      });
      expectLiquidValue(v, "", true, "error");
      await promise;
      expectLiquidValue(v, "", false, "error2");
    });
  });

  describe("clearErrorBeforeLoading", () => {
    test("init -> success", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => ok("ok"), {
        clearErrorBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("init -> error", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => err(new BaseError("error")), {
        clearErrorBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("success -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => ok("ok2"), {
        clearErrorBeforeLoading: true,
      });
      expectLiquidValue(v, "ok", true);
      await promise;
      expectLiquidValue(v, "ok2", false);
    });

    test("success -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => err(new BaseError("error")), {
        clearErrorBeforeLoading: true,
      });
      expectLiquidValue(v, "ok", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("error -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => ok("ok"), {
        clearErrorBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("error -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => err(new BaseError("error2")), {
        clearErrorBeforeLoading: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "", false, "error2");
    });
  });

  describe("keepValueIfError", () => {
    test("init -> success", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => ok("ok"), {
        keepValueIfError: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("init -> error", async () => {
      const v = new LiquidValue<string>("");

      expectLiquidValue(v, "", false);
      const promise = v.load(async () => err(new BaseError("error")), {
        keepValueIfError: true,
      });
      expectLiquidValue(v, "", true);
      await promise;
      expectLiquidValue(v, "", false, "error");
    });

    test("success -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => ok("ok2"), {
        keepValueIfError: true,
      });
      expectLiquidValue(v, "ok", true);
      await promise;
      expectLiquidValue(v, "ok2", false);
    });

    test("success -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => ok("ok"));

      const promise = v.load(async () => err(new BaseError("error")), {
        keepValueIfError: true,
      });
      expectLiquidValue(v, "ok", true);
      await promise;
      expectLiquidValue(v, "ok", false, "error");
    });

    test("error -> success", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => ok("ok"), {
        keepValueIfError: true,
      });
      expectLiquidValue(v, "", true, "error");
      await promise;
      expectLiquidValue(v, "ok", false);
    });

    test("error -> error", async () => {
      const v = new LiquidValue<string>("");
      await v.load(async () => err(new BaseError("error")));

      const promise = v.load(async () => err(new BaseError("error2")), {
        keepValueIfError: true,
      });
      expectLiquidValue(v, "", true, "error");
      await promise;
      expectLiquidValue(v, "", false, "error2");
    });
  });
});
