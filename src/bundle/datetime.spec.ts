import { DateTime } from "./datetime";

describe("DateTime", () => {
  describe.each`
    value                    | expected
    ${"2020-02-02"}          | ${"2020-02-02T00:00:00"}
    ${"2020-02-02 10:10:10"} | ${"2020-02-02T10:10:10"}
    ${"2020/02/02"}          | ${"2020-02-02T00:00:00"}
    ${"2020/02/02 20:20:20"} | ${"2020-02-02T20:20:20"}
  `("DateTime.of", ({ value, expected }) => {
    test(`DateTime.of(${value}) = ${expected}`, () => {
      // TODO: Specify timezone...
      expect(DateTime.of(value).rfc3339).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    self                     | days | expected
    ${"2020-01-01 10:00:00"} | ${3} | ${"2020-01-04T10:00:00"}
  `("plusDays", ({ self, days, expected }) => {
    test(`(${self}).plusDays(${days}) = ${expected}`, () => {
      expect(DateTime.of(self).plusDays(days).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | seconds | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T10:00:03"}
  `("plusSeconds", ({ self, seconds, expected }) => {
    test(`(${self}).plusSeconds(${seconds}) = ${expected}`, () => {
      expect(DateTime.of(self).plusSeconds(seconds).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | begin                    | end                      | includeBegin | includeEnd | ignoreTime | expected
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:01"} | ${true}      | ${true}    | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:01"} | ${false}     | ${true}    | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:01"} | ${true}      | ${false}   | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:01"} | ${false}     | ${false}   | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:58"} | ${"2020-01-01 00:00:59"} | ${true}      | ${true}    | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:00"} | ${true}      | ${true}    | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${true}      | ${true}    | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${"2020-01-01 00:01:02"} | ${true}      | ${true}    | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:58"} | ${"2020-01-01 00:00:59"} | ${false}     | ${true}    | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:00"} | ${false}     | ${true}    | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${false}     | ${true}    | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${"2020-01-01 00:01:02"} | ${false}     | ${true}    | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:58"} | ${"2020-01-01 00:00:59"} | ${true}      | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:00"} | ${true}      | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${true}      | ${false}   | ${false}   | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${"2020-01-01 00:01:02"} | ${true}      | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:58"} | ${"2020-01-01 00:00:59"} | ${false}     | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:00"} | ${false}     | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${false}     | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:01:01"} | ${"2020-01-01 00:01:02"} | ${false}     | ${false}   | ${false}   | ${false}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:58"} | ${"2020-01-01 00:00:59"} | ${true}      | ${true}    | ${true}    | ${true}
    ${"2020-01-01 00:01:00"} | ${"2020-01-01 00:00:59"} | ${"2020-01-01 00:01:01"} | ${false}     | ${false}   | ${true}    | ${false}
  `(
    "between",
    ({ self, begin, end, includeBegin, includeEnd, ignoreTime, expected }) => {
      test(`(${self}).between(${begin}, ${end})(includeBegin: ${includeBegin})(includeEnd: ${includeEnd})(ignoreTime: ${ignoreTime}) = ${expected}`, () => {
        expect(
          DateTime.of(self).between(DateTime.of(begin), DateTime.of(end), {
            includeBegin,
            includeEnd,
            ignoreTime,
          })
        ).toBe(expected);
      });
    }
  );
});
