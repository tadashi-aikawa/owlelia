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
      // TODO: Add     ${1633584227}                        | ${"2021-10-07T14:23:47"}
      expect(DateTime.of(value).rfc3339).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    value           | format          | expected
    ${"2020-02-02"} | ${"YYYY-MM-DD"} | ${"2020-02-02T00:00:00"}
    ${"02-02-2020"} | ${"MM-DD-YYYY"} | ${"2020-02-02T00:00:00"}
    ${"20_02_02"}   | ${"YY_MM_DD"}   | ${"2020-02-02T00:00:00"}
    ${"2020/02/02"} | ${undefined}    | ${"2020-02-02T00:00:00"}
  `("DateTime.from", ({ value, format, expected }) => {
    test(`DateTime.from(${value}, ${format}) = ${expected}`, () => {
      expect(DateTime.from(value, format).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
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
        new RegExp(`^${expected}.+`),
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
    self                     | end                      | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-03 10:00:00"} | ${["2020-01-01T00:00:00", "2020-01-02T00:00:00", "2020-01-03T00:00:00"]}
    ${"2020-01-03 10:00:00"} | ${"2020-01-01 10:00:00"} | ${["2020-01-03T00:00:00", "2020-01-02T00:00:00", "2020-01-01T00:00:00"]}
    ${"2020-12-31 00:00:00"} | ${"2021-01-01 00:00:00"} | ${["2020-12-31T00:00:00", "2021-01-01T00:00:00"]}
    ${"2021-01-01 00:00:00"} | ${"2020-12-31 00:00:00"} | ${["2021-01-01T00:00:00", "2020-12-31T00:00:00"]}
  `("toDate", ({ self, end, expected }) => {
    test(`(${self}).toDate(${end}) = ${expected}`, () => {
      const actual = DateTime.of(self).toDate(DateTime.of(end));
      actual.forEach((a, i) => {
        expect(a.rfc3339).toMatch(new RegExp(`^${expected[i]}.+`));
      });
    });
  });

  describe.each`
    self                     | year    | expected
    ${"2020-01-01 10:00:00"} | ${2000} | ${"2000-01-01T10:00:00"}
    ${"2020-01-02 10:00:00"} | ${2010} | ${"2010-01-02T10:00:00"}
  `("replaceYear", ({ self, year, expected }) => {
    test(`(${self}).replaceYear(${year}) = ${expected}`, () => {
      expect(DateTime.of(self).replaceYear(year).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | month | expected
    ${"2020-01-01 10:00:00"} | ${11} | ${"2020-11-01T10:00:00"}
    ${"2020-01-02 10:00:00"} | ${3}  | ${"2020-03-02T10:00:00"}
  `("replaceMonth", ({ self, month, expected }) => {
    test(`(${self}).replaceMonth(${month}) = ${expected}`, () => {
      expect(DateTime.of(self).replaceMonth(month).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | day   | expected
    ${"2020-01-01 10:00:00"} | ${20} | ${"2020-01-20T10:00:00"}
    ${"2020-01-02 10:00:00"} | ${9}  | ${"2020-01-09T10:00:00"}
  `("replaceDay", ({ self, day, expected }) => {
    test(`(${self}).replaceDay(${day}) = ${expected}`, () => {
      expect(DateTime.of(self).replaceDay(day).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | hour  | expected
    ${"2020-01-01 10:01:02"} | ${20} | ${"2020-01-01T20:01:02"}
    ${"2020-01-02 11:03:04"} | ${9}  | ${"2020-01-02T09:03:04"}
  `("replaceHour", ({ self, hour, expected }) => {
    test(`(${self}).replaceHour(${hour}) = ${expected}`, () => {
      expect(DateTime.of(self).replaceHour(hour).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | minute | expected
    ${"2020-01-01 10:01:02"} | ${20}  | ${"2020-01-01T10:20:02"}
    ${"2020-01-02 11:03:04"} | ${9}   | ${"2020-01-02T11:09:04"}
  `("replaceMinute", ({ self, minute, expected }) => {
    test(`(${self}).replaceMinute(${minute}) = ${expected}`, () => {
      expect(DateTime.of(self).replaceMinute(minute).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | second | expected
    ${"2020-01-01 10:01:02"} | ${20}  | ${"2020-01-01T10:01:20"}
    ${"2020-01-02 11:03:04"} | ${9}   | ${"2020-01-02T11:03:09"}
  `("replaceSecond", ({ self, second, expected }) => {
    test(`(${self}).replaceSecond(${second}) = ${expected}`, () => {
      expect(DateTime.of(self).replaceSecond(second).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 10:01:02"} | ${"2020-01-01T00:00:00"}
    ${"2020-01-02 11:03:04"} | ${"2020-01-02T00:00:00"}
  `("midnight", ({ self, expected }) => {
    test(`(${self}).midnight() = ${expected}`, () => {
      expect(DateTime.of(self).midnight().rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | months | expected
    ${"2020-01-01 10:00:00"} | ${2}   | ${"2020-03-01T10:00:00"}
  `("plusMonths", ({ self, months, expected }) => {
    test(`(${self}).plusMonths(${months}) = ${expected}`, () => {
      expect(DateTime.of(self).plusMonths(months).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | days  | expected
    ${"2020-01-01 10:00:00"} | ${20} | ${"2020-01-21T10:00:00"}
  `("plusDays", ({ self, days, expected }) => {
    test(`(${self}).plusDays(${days}) = ${expected}`, () => {
      expect(DateTime.of(self).plusDays(days).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
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
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | hours | expected
    ${"2020-01-01 10:00:00"} | ${3}  | ${"2020-01-01T13:00:00"}
  `("plusHours", ({ self, hours, expected }) => {
    test(`(${self}).plusHours(${hours}) = ${expected}`, () => {
      expect(DateTime.of(self).plusHours(hours).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | minutes | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T10:03:00"}
  `("plusMinutes", ({ self, minutes, expected }) => {
    test(`(${self}).plusMinutes(${minutes}) = ${expected}`, () => {
      expect(DateTime.of(self).plusMinutes(minutes).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | seconds | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T10:00:03"}
  `("plusSeconds", ({ self, seconds, expected }) => {
    test(`(${self}).plusSeconds(${seconds}) = ${expected}`, () => {
      expect(DateTime.of(self).plusSeconds(seconds).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | months | expected
    ${"2020-01-01 10:00:00"} | ${2}   | ${"2019-11-01T10:00:00"}
  `("minusMonth", ({ self, months, expected }) => {
    test(`(${self}).minusMonth(${months}) = ${expected}`, () => {
      expect(DateTime.of(self).minusMonth(months).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | days  | expected
    ${"2020-01-01 10:00:00"} | ${13} | ${"2019-12-19T10:00:00"}
  `("minusDays", ({ self, days, expected }) => {
    test(`(${self}).minusDays(${days}) = ${expected}`, () => {
      expect(DateTime.of(self).minusDays(days).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | hours | expected
    ${"2020-01-01 10:00:00"} | ${3}  | ${"2020-01-01T07:00:00"}
  `("minusHours", ({ self, hours, expected }) => {
    test(`(${self}).minusHours(${hours}) = ${expected}`, () => {
      expect(DateTime.of(self).minusHours(hours).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | minutes | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T09:57:00"}
  `("minusMinutes", ({ self, minutes, expected }) => {
    test(`(${self}).minusMinutes(${minutes}) = ${expected}`, () => {
      expect(DateTime.of(self).minusMinutes(minutes).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | seconds | expected
    ${"2020-01-01 10:00:00"} | ${3}    | ${"2020-01-01T09:59:57"}
  `("minusSeconds", ({ self, seconds, expected }) => {
    test(`(${self}).minusSeconds(${seconds}) = ${expected}`, () => {
      expect(DateTime.of(self).minusSeconds(seconds).rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 10:00:00"} | ${"2020-01-31T23:59:59"}
    ${"2020-02-02 10:00:00"} | ${"2020-02-29T23:59:59"}
    ${"2020-04-04 10:00:00"} | ${"2020-04-30T23:59:59"}
  `("endOfMonth", ({ self, expected }) => {
    test(`(${self}).endOfMonth() = ${expected}`, () => {
      expect(DateTime.of(self).endOfMonth().rfc3339).toMatch(
        new RegExp(`^${expected}.+`),
      );
    });
  });

  describe.each`
    self                     | date                     | expected
    ${"2020-01-01 10:00:00"} | ${"2020-02-02 17:00:00"} | ${"2020-02-02T10:00:00"}
  `("overwriteDate", ({ self, date, expected }) => {
    test(`(${self}).overwriteDate(${date}) = ${expected}`, () => {
      expect(
        DateTime.of(self).overwriteDate(DateTime.of(date)).rfc3339,
      ).toMatch(new RegExp(`^${expected}.+`));
    });
  });

  describe.each`
    date                     | self                     | expected
    ${"2019-11-01 10:00:00"} | ${"2020-01-01 10:00:00"} | ${2}
    ${"2020-01-01 00:00:00"} | ${"2019-12-31 23:59:59"} | ${-1}
  `("diffMonths", ({ date, self, expected }) => {
    test(`(${self}).diffMonths(${date}) = ${expected}`, () => {
      expect(DateTime.of(self).diffMonths(DateTime.of(date))).toBe(expected);
    });
  });

  describe.each`
    date                     | self                     | expected
    ${"2020-12-30 22:00:00"} | ${"2021-01-01 10:00:00"} | ${2}
    ${"2020-01-01 00:00:00"} | ${"2019-12-31 23:59:59"} | ${-1}
    ${"2020-10-01 00:00:00"} | ${"2020-12-01 23:59:59"} | ${30 + 31}
  `("diffDays", ({ date, self, expected }) => {
    test(`(${self}).diffDays(${date}) = ${expected}`, () => {
      expect(DateTime.of(self).diffDays(DateTime.of(date))).toBe(expected);
    });
  });

  describe.each`
    date                     | self                     | expected
    ${"2020-12-30 22:00:00"} | ${"2021-01-01 10:00:00"} | ${36}
    ${"2020-01-01 00:00:00"} | ${"2019-12-31 23:59:59"} | ${-1}
    ${"2020-10-01 00:00:00"} | ${"2020-12-01 23:59:59"} | ${(30 + 31) * 24 + 23}
  `("diffHours", ({ date, self, expected }) => {
    test(`(${self}).diffHours(${date}) = ${expected}`, () => {
      expect(DateTime.of(self).diffHours(DateTime.of(date))).toBe(expected);
    });
  });

  describe.each`
    date                     | self                     | expected
    ${"2020-12-30 22:00:00"} | ${"2021-01-01 10:00:00"} | ${2160}
    ${"2020-01-01 00:00:00"} | ${"2019-12-31 23:59:59"} | ${-1}
    ${"2020-10-01 00:00:00"} | ${"2020-12-01 23:59:59"} | ${((30 + 31) * 24 + 23) * 60 + 59}
  `("diffMinutes", ({ date, self, expected }) => {
    test(`(${self}).diffMinutes(${date}) = ${expected}`, () => {
      expect(DateTime.of(self).diffMinutes(DateTime.of(date))).toBe(expected);
    });
  });

  // noinspection OverlyComplexArithmeticExpressionJS
  describe.each`
    date                     | self                     | expected
    ${"2020-12-30 22:00:00"} | ${"2021-01-01 10:00:00"} | ${129600}
    ${"2020-01-01 00:00:00"} | ${"2019-12-31 23:59:59"} | ${-1}
    ${"2020-10-01 00:00:00"} | ${"2020-12-01 23:59:59"} | ${(((30 + 31) * 24 + 23) * 60 + 59) * 60 + 59}
  `("diffSeconds", ({ date, self, expected }) => {
    test(`(${self}).diffSeconds(${date}) = ${expected}`, () => {
      expect(DateTime.of(self).diffSeconds(DateTime.of(date))).toBe(expected);
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
        expected,
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
        expected,
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
        DateTime.of(self).isBefore(DateTime.of(dateTime), ignoreTime),
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
        DateTime.of(self).isAfterOrEquals(DateTime.of(dateTime), ignoreTime),
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
        DateTime.of(self).isBeforeOrEquals(DateTime.of(dateTime), ignoreTime),
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
          }),
        ).toBe(expected);
      });
    },
  );

  describe.each`
    self                     | template                 | expected
    ${"2020-01-02 03:45:06"} | ${"YYYY年M月D日"}        | ${"2020年1月2日"}
    ${"2020-11-02 23:45:06"} | ${"YYYY-MM-DD HH:mm:ss"} | ${"2020-11-02 23:45:06"}
  `("format", ({ self, template, expected }) => {
    test(`(${self}).format(${template}) = ${expected}`, () => {
      expect(DateTime.of(self).format(template)).toBe(expected);
    });
  });

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
    ${"2020-01-01 00:00:00"} | ${202001}
    ${"2021-12-31 00:00:01"} | ${202112}
  `("yearMonth", ({ self, expected }) => {
    test(`(${self}).yearMonth = ${expected}`, () => {
      expect(DateTime.of(self).yearMonth).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 12:34:56"} | ${12}
  `("hour", ({ self, expected }) => {
    test(`(${self}).hour = ${expected}`, () => {
      expect(DateTime.of(self).hour).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 12:34:56"} | ${34}
  `("minute", ({ self, expected }) => {
    test(`(${self}).minute = ${expected}`, () => {
      expect(DateTime.of(self).minute).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-01-01 12:34:56"} | ${56}
  `("second", ({ self, expected }) => {
    test(`(${self}).second = ${expected}`, () => {
      expect(DateTime.of(self).second).toBe(expected);
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
    ${"2020-12-06 23:59:59"} | ${false}
    ${"2020-12-07 00:00:00"} | ${true}
    ${"2020-12-07 23:59:59"} | ${true}
    ${"2020-12-08 00:00:00"} | ${false}
  `("isMonday", ({ self, expected }) => {
    test(`(${self}).isMonday = ${expected}`, () => {
      expect(DateTime.of(self).isMonday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-07 23:59:59"} | ${false}
    ${"2020-12-08 00:00:00"} | ${true}
    ${"2020-12-08 23:59:59"} | ${true}
    ${"2020-12-09 00:00:00"} | ${false}
  `("isTuesday", ({ self, expected }) => {
    test(`(${self}).isTuesday = ${expected}`, () => {
      expect(DateTime.of(self).isTuesday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-08 23:59:59"} | ${false}
    ${"2020-12-09 00:00:00"} | ${true}
    ${"2020-12-09 23:59:59"} | ${true}
    ${"2020-12-10 00:00:00"} | ${false}
  `("isWednesday", ({ self, expected }) => {
    test(`(${self}).isWednesday = ${expected}`, () => {
      expect(DateTime.of(self).isWednesday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-09 23:59:59"} | ${false}
    ${"2020-12-10 00:00:00"} | ${true}
    ${"2020-12-10 23:59:59"} | ${true}
    ${"2020-12-11 00:00:00"} | ${false}
  `("isThursday", ({ self, expected }) => {
    test(`(${self}).isThursday = ${expected}`, () => {
      expect(DateTime.of(self).isThursday).toBe(expected);
    });
  });

  describe.each`
    self                     | expected
    ${"2020-12-10 23:59:59"} | ${false}
    ${"2020-12-11 00:00:00"} | ${true}
    ${"2020-12-11 23:59:59"} | ${true}
    ${"2020-12-12 00:00:00"} | ${false}
  `("isFriday", ({ self, expected }) => {
    test(`(${self}).isFriday = ${expected}`, () => {
      expect(DateTime.of(self).isFriday).toBe(expected);
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
    ${"2023-02-04 00:00:00"} | ${1}
    ${"2023-02-05 00:00:00"} | ${1}
    ${"2023-02-11 00:00:00"} | ${2}
    ${"2023-02-12 00:00:00"} | ${2}
  `("nthDayOfWeek", ({ self, expected }) => {
    test(`(${self}).nthDayOfWeek = ${expected}`, () => {
      expect(DateTime.of(self).nthDayOfWeek).toBe(expected);
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
    ${"2020-01-01 00:01:30"} | ${"20200101"}
    ${"2020-10-10 13:10:00"} | ${"20201010"}
  `("yyyyMMdd", ({ self, expected }) => {
    test(`(${self}).yyyyMMdd = ${expected}`, () => {
      expect(DateTime.of(self).yyyyMMdd).toBe(expected);
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
