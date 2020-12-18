import { DateTime } from "./datetime";
import MockDate from "mockdate";

DateTime.setHolidays("2020-07-07", "2020-12-02", "2020-12-24");

describe("DateTime", () => {
  describe.each`
    value                                | expected
    ${"2020-02-02"}                      | ${"2020-02-02T00:00:00"}
    ${"2020-02-02 10:10:10"}             | ${"2020-02-02T10:10:10"}
    ${"2020/02/02"}                      | ${"2020-02-02T00:00:00"}
    ${"2020/02/02 20:20:20"}             | ${"2020-02-02T20:20:20"}
    ${new Date(2020, 0, 1, 0, 1, 30, 0)} | ${"2020-01-01T00:01:30"}
  `("DateTime.of", ({ value, expected }) => {
    test(`DateTime.of(${value}) = ${expected}`, () => {
      // TODO: Specify timezone...
      expect(DateTime.of(value).rfc3339).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    now                      | expected
    ${"2020-01-01 00:03:00"} | ${"2020-01-01T00:03:00"}
    ${"2020-01-01 23:03:00"} | ${"2020-01-01T23:03:00"}
  `("DateTime.now", ({ now, expected }) => {
    test(`DateTime.now()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.now().rfc3339).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    now                      | expected
    ${"2020-01-01 00:03:00"} | ${"2020-01-01T00:00:00"}
    ${"2020-01-01 23:03:00"} | ${"2020-01-01T00:00:00"}
  `("DateTime.today", ({ now, expected }) => {
    test(`DateTime.today()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.today().rfc3339).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    now                      | expected
    ${"2020-01-01 00:03:00"} | ${"2019-12-31T00:00:00"}
    ${"2020-01-01 23:03:00"} | ${"2019-12-31T00:00:00"}
  `("DateTime.yesterday", ({ now, expected }) => {
    test(`DateTime.yesterday()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.yesterday().rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    now                      | expected
    ${"2020-01-01 00:03:00"} | ${"2020-01-02T00:00:00"}
    ${"2020-01-01 23:03:00"} | ${"2020-01-02T00:00:00"}
  `("DateTime.tomorrow", ({ now, expected }) => {
    test(`DateTime.tomorrow()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.tomorrow().rfc3339).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    value           | format          | expected
    ${"2020-01-01"} | ${"YYYY-MM-DD"} | ${true}
    ${"2020-01-31"} | ${"YYYY-MM-DD"} | ${true}
    ${"2020-01-32"} | ${"YYYY-MM-DD"} | ${false}
    ${"2020-01-01"} | ${"YYYY/MM/DD"} | ${false}
  `("DateTime.isValid", ({ value, format, expected }) => {
    test(`DateTime.isValid(${value}, ${format}) = ${expected}`, () => {
      expect(DateTime.isValid(value, format)).toBe(expected);
    });
  });

  describe.each`
    self                     | months | expected
    ${"2020-01-01 10:00:00"} | ${2}   | ${"2020-03-01T10:00:00"}
  `("plusMonths", ({ self, months, expected }) => {
    test(`(${self}).plusMonths(${months}) = ${expected}`, () => {
      expect(DateTime.of(self).plusMonths(months).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
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
    self                     | days | expected
    ${"2020-12-01 00:00:00"} | ${2} | ${"2020-12-04T00:00:00"}
    ${"2020-12-03 00:00:00"} | ${3} | ${"2020-12-08T00:00:00"}
  `("plusWeekdays", ({ self, days, expected }) => {
    test(`(${self}).plusWeekdays(${days}) = ${expected}`, () => {
      expect(DateTime.of(self).plusWeekdays(days).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | hours | expected
    ${"2020-01-01 10:00:00"} | ${3}  | ${"2020-01-01T13:00:00"}
  `("plusHours", ({ self, hours, expected }) => {
    test(`(${self}).plusHours(${hours}) = ${expected}`, () => {
      expect(DateTime.of(self).plusHours(hours).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | minutes | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T10:03:00"}
  `("plusMinutes", ({ self, minutes, expected }) => {
    test(`(${self}).plusMinutes(${minutes}) = ${expected}`, () => {
      expect(DateTime.of(self).plusMinutes(minutes).rfc3339).toMatch(
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
    self                     | days | expected
    ${"2020-01-01 10:00:00"} | ${3} | ${"2019-12-29T10:00:00"}
  `("minusDays", ({ self, days, expected }) => {
    test(`(${self}).minusDays(${days}) = ${expected}`, () => {
      expect(DateTime.of(self).minusDays(days).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | hours | expected
    ${"2020-01-01 10:00:00"} | ${3}  | ${"2020-01-01T07:00:00"}
  `("minusHours", ({ self, hours, expected }) => {
    test(`(${self}).minusHours(${hours}) = ${expected}`, () => {
      expect(DateTime.of(self).minusHours(hours).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | minutes | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T09:57:00"}
  `("minusMinutes", ({ self, minutes, expected }) => {
    test(`(${self}).minusMinutes(${minutes}) = ${expected}`, () => {
      expect(DateTime.of(self).minusMinutes(minutes).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | seconds | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T09:59:57"}
  `("minusSeconds", ({ self, seconds, expected }) => {
    test(`(${self}).minusSeconds(${seconds}) = ${expected}`, () => {
      expect(DateTime.of(self).minusSeconds(seconds).rfc3339).toMatch(
        new RegExp(`^${expected}.+`)
      );
    });
  });

  describe.each`
    self                     | date                     | expected
    ${"2020-01-01 10:00:00"} | ${"2020-02-02 17:00:00"} | ${"2020-02-02T10:00:00"}
  `("overwriteDate", ({ self, date, expected }) => {
    test(`(${self}).overwriteDate(${date}) = ${expected}`, () => {
      expect(
        DateTime.of(self).overwriteDate(DateTime.of(date)).rfc3339
      ).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    now                      | self                     | expected
    ${"2020-01-01 10:03:00"} | ${"2020-01-01 10:00:00"} | ${3}
    ${"2020-01-01 10:03:01"} | ${"2020-01-01 10:00:00"} | ${3}
    ${"2020-01-01 10:02:59"} | ${"2020-01-01 10:00:00"} | ${2}
  `("diffMinutesFromNow", ({ now, self, expected }) => {
    test(`(${self}).diffMinutesFromNow()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.of(self).diffMinutesFromNow()).toBe(expected);
    });
  });

  describe.each`
    now                      | self                     | expected
    ${"2020-01-01 10:03:00"} | ${"2020-01-01 10:00:00"} | ${180}
    ${"2020-01-01 10:03:01"} | ${"2020-01-01 10:00:00"} | ${181}
    ${"2020-01-01 10:02:59"} | ${"2020-01-01 10:00:00"} | ${179}
  `("diffSecondsFromNow", ({ now, self, expected }) => {
    test(`(${self}).diffSecondsFromNow()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.of(self).diffSecondsFromNow()).toBe(expected);
    });
  });

  describe.each`
    now                      | self                     | expected
    ${"2020-01-01 10:00:09"} | ${"2020-01-01 10:00:00"} | ${"00:00:09"}
    ${"2020-01-01 10:59:09"} | ${"2020-01-01 10:00:00"} | ${"00:59:09"}
    ${"2020-01-01 11:00:00"} | ${"2020-01-01 10:00:00"} | ${"01:00:00"}
  `("displayDiffFromNow", ({ now, self, expected }) => {
    test(`(${self}).displayDiffFromNow()(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.of(self).displayDiffFromNow()).toBe(expected);
    });
  });

  describe.each`
    now                      | self                     | seconds | expected
    ${"2020-01-01 10:00:09"} | ${"2020-01-01 10:00:00"} | ${10}   | ${true}
    ${"2020-01-01 10:00:10"} | ${"2020-01-01 10:00:00"} | ${10}   | ${true}
    ${"2020-01-01 10:00:11"} | ${"2020-01-01 10:00:00"} | ${10}   | ${false}
  `("within", ({ now, self, seconds, expected }) => {
    test(`(${self}).within(${seconds})(now = ${now}) = ${expected}`, () => {
      MockDate.set(now);
      expect(DateTime.of(self).within(seconds)).toBe(expected);
    });
  });

  describe.each`
    self                     | dateTime                 | ignoreTime | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 11:11:11"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 11:11:11"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${false}   | ${false}
  `("equals", ({ self, dateTime, ignoreTime, expected }) => {
    test(`(${self}).equals(${dateTime}, ${ignoreTime}) = ${expected}`, () => {
      expect(DateTime.of(self).equals(DateTime.of(dateTime), ignoreTime)).toBe(
        expected
      );
    });
  });

  describe.each`
    self                     | dateTime                 | ignoreTime | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${false}   | ${true}
  `("isAfter", ({ self, dateTime, ignoreTime, expected }) => {
    test(`(${self}).isAfter(${dateTime}, ${ignoreTime}) = ${expected}`, () => {
      expect(DateTime.of(self).isAfter(DateTime.of(dateTime), ignoreTime)).toBe(
        expected
      );
    });
  });

  describe.each`
    self                     | dateTime                 | ignoreTime | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${false}   | ${false}
  `("isBefore", ({ self, dateTime, ignoreTime, expected }) => {
    test(`(${self}).isBefore(${dateTime}, ${ignoreTime}) = ${expected}`, () => {
      expect(
        DateTime.of(self).isBefore(DateTime.of(dateTime), ignoreTime)
      ).toBe(expected);
    });
  });

  describe.each`
    self                     | dateTime                 | ignoreTime | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${false}   | ${true}
  `("isAfterOrEquals", ({ self, dateTime, ignoreTime, expected }) => {
    test(`(${self}).isAfterOrEquals(${dateTime}, ${ignoreTime}) = ${expected}`, () => {
      expect(
        DateTime.of(self).isAfterOrEquals(DateTime.of(dateTime), ignoreTime)
      ).toBe(expected);
    });
  });

  describe.each`
    self                     | dateTime                 | ignoreTime | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 09:59:59"} | ${false}   | ${false}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-01 10:00:01"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${true}    | ${true}
    ${"2020-01-01 10:00:00"} | ${"2020-01-02 10:00:00"} | ${false}   | ${true}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${true}    | ${false}
    ${"2020-01-01 10:00:00"} | ${"2019-12-31 10:00:00"} | ${false}   | ${false}
  `("isBeforeOrEquals", ({ self, dateTime, ignoreTime, expected }) => {
    test(`(${self}).isBeforeOrEquals(${dateTime}, ${ignoreTime}) = ${expected}`, () => {
      expect(
        DateTime.of(self).isBeforeOrEquals(DateTime.of(dateTime), ignoreTime)
      ).toBe(expected);
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

  describe.each`
    self                     | expected
    ${"2020-01-01 00:00:00"} | ${2020}
    ${"2021-12-31 00:00:01"} | ${2021}
  `("year", ({ self, expected }) => {
    test(`(${self}).year = ${expected}`, () => {
      expect(DateTime.of(self).year).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:00:00"} | ${1}
    ${"2021-12-31 00:00:01"} | ${12}
  `("month", ({ self, expected }) => {
    test(`(${self}).month = ${expected}`, () => {
      expect(DateTime.of(self).month).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:00:00"} | ${1}
    ${"2021-12-31 00:00:01"} | ${31}
  `("day", ({ self, expected }) => {
    test(`(${self}).day = ${expected}`, () => {
      expect(DateTime.of(self).day).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-05 00:00:00"} | ${true}
    ${"2020-01-05 00:00:01"} | ${false}
    ${"2020-01-04 23:59:59"} | ${false}
  `("isStartOfDay", ({ self, expected }) => {
    test(`(${self}).isStartOfDay = ${expected}`, () => {
      expect(DateTime.of(self).isStartOfDay).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-04 00:00:00"} | ${false}
    ${"2020-12-05 10:00:00"} | ${true}
    ${"2020-12-06 23:59:59"} | ${false}
  `("isSaturday", ({ self, expected }) => {
    test(`(${self}).isSaturday = ${expected}`, () => {
      expect(DateTime.of(self).isSaturday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-04 00:00:00"} | ${false}
    ${"2020-12-05 10:00:00"} | ${false}
    ${"2020-12-06 23:59:59"} | ${true}
  `("isSunday", ({ self, expected }) => {
    test(`(${self}).isSunday = ${expected}`, () => {
      expect(DateTime.of(self).isSunday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:00:00"} | ${false}
    ${"2020-07-07 10:00:00"} | ${true}
    ${"2020-12-24 23:59:59"} | ${true}
  `("isHoliday", ({ self, expected }) => {
    test(`(${self}).isHoliday = ${expected}`, () => {
      expect(DateTime.of(self).isHoliday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-01 00:00:00"} | ${true}
    ${"2020-12-02 03:00:00"} | ${false}
    ${"2020-12-03 06:00:00"} | ${true}
    ${"2020-12-04 09:00:00"} | ${true}
    ${"2020-12-05 12:00:00"} | ${false}
    ${"2020-12-06 15:00:00"} | ${false}
    ${"2020-12-07 18:00:00"} | ${true}
  `("isWeekday", ({ self, expected }) => {
    test(`(${self}).isWeekday = ${expected}`, () => {
      expect(DateTime.of(self).isWeekday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${new Date(2020, 0, 1, 0, 1, 30, 0).getTime()}
  `("date", ({ self, expected }) => {
    test(`(${self}).date = ${expected}`, () => {
      expect(DateTime.of(self).date.getTime()).toBe(expected);
    });
  });

  describe.each`
    self                           | expected
    ${"1970-01-01 00:01:30+00:00"} | ${90}
  `("unix", ({ self, expected }) => {
    test(`(${self}).unix = ${expected}`, () => {
      expect(DateTime.of(self).unix).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"2020-01-01T00:01:30\\+[0-9]{2}:00"}
  `("rfc3339", ({ self, expected }) => {
    test(`(${self}).rfc3339 = ${expected}`, () => {
      expect(DateTime.of(self).rfc3339).toMatch(new RegExp(`^${expected}$`));
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"2020-01-01T00:01:30"}
  `("rfc3339WithoutTimezone", ({ self, expected }) => {
    test(`(${self}).rfc3339WithoutTimezone = ${expected}`, () => {
      expect(DateTime.of(self).rfc3339WithoutTimezone).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"00:01:30"}
  `("displayTime", ({ self, expected }) => {
    test(`(${self}).displayTime = ${expected}`, () => {
      expect(DateTime.of(self).displayTime).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"00:01"}
  `("displayTimeWithoutSeconds", ({ self, expected }) => {
    test(`(${self}).displayTimeWithoutSeconds = ${expected}`, () => {
      expect(DateTime.of(self).displayTimeWithoutSeconds).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"2020-01-01"}
  `("displayDate", ({ self, expected }) => {
    test(`(${self}).displayDate = ${expected}`, () => {
      expect(DateTime.of(self).displayDate).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"2020-01-01 (Wed)"}
  `("displayDateFull", ({ self, expected }) => {
    test(`(${self}).displayDateFull = ${expected}`, () => {
      expect(DateTime.of(self).displayDateFull).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"2020-01-01 00:01:30"}
  `("displayDateTime", ({ self, expected }) => {
    test(`(${self}).displayDateTime = ${expected}`, () => {
      expect(DateTime.of(self).displayDateTime).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"2020-01-01 00:01"}
  `("displayDateTimeWithoutSeconds", ({ self, expected }) => {
    test(`(${self}).displayDateTimeWithoutSeconds = ${expected}`, () => {
      expect(DateTime.of(self).displayDateTimeWithoutSeconds).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:01:30"} | ${"20200101000130"}
    ${"2020-10-10 13:10:00"} | ${"20201010131000"}
  `("yyyyMMddHHmmss", ({ self, expected }) => {
    test(`(${self}).yyyyMMddHHmmss = ${expected}`, () => {
      expect(DateTime.of(self).yyyyMMddHHmmss).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 00:00:01"} | ${"1秒"}
    ${"2020-01-01 00:00:59"} | ${"59秒"}
    ${"2020-01-01 00:01:00"} | ${"1分"}
    ${"2020-01-01 00:01:01"} | ${"1分"}
    ${"2020-01-01 00:59:59"} | ${"59分"}
    ${"2020-01-01 01:00:00"} | ${"1時間"}
    ${"2020-01-01 01:00:01"} | ${"1時間"}
    ${"2020-01-01 01:01:00"} | ${"1時間1分"}
    ${"2020-01-01 01:01:01"} | ${"1時間1分"}
    ${"2020-01-01 10:01:01"} | ${"10時間1分"}
  `("displayDiffFromNowJapanese", ({ self, expected }) => {
    test(`(${self}).displayDiffFromNowJapanese() = ${expected}`, () => {
      expect(DateTime.of(self).displayDiffFromNowJapanese()).toBe(expected);
    });
  });
});
