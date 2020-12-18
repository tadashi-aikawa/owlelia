import { ValueObject } from "../vo";
import dayjs from "dayjs";
import "dayjs/locale/ja";

const pad00 = (v: number): string => String(v).padStart(2, "0");

function keyBy<T>(xs: T[], toKey: (x: T) => string): { [key: string]: T } {
  const result: { [key: string]: T } = {};
  for (const x of xs) {
    result[toKey(x)] = x;
  }
  return result;
}

/**
 * seconds -> HH:mm:ss
 * ex
 *   131 -> 00:02:11
 * @param seconds
 */
function toHHmmss(seconds: number): string {
  const hour = (seconds / (60 * 60)) | 0;
  const min = ((seconds % (60 * 60)) / 60) | 0;
  const sec = seconds % 60;
  return `${pad00(hour)}:${pad00(min)}:${pad00(sec)}`;
}

export class DateTime extends ValueObject<dayjs.Dayjs> {
  private _owleliaVoCommonDateTimeBrand!: never;

  private static holidays: DateTime[];
  private static holidayByDisplayDate: { [date: string]: DateTime };

  /**
   * Set specific holidays.
   * It is used by {@link DateTime.isHoliday}, {@link DateTime.isWeekday} and so on.
   * @param dates  String date formats which can supported by {@link DateTime.of}
   *
   * @example Set 2020-01-01, 2020-01-02 and 2020-01-03 as a holiday.
   * ```typescript
   * DateTime.setHolidays("2020-01-01", "2020-01-02", "2020-01-03")
   * ```
   */
  static setHolidays(...dates: string[]): void {
    this.holidays = dates.map(DateTime.of);
    this.holidayByDisplayDate = keyBy(this.holidays, (x) => x.displayDate);
  }

  /**
   * Create instance from any formats.
   * @param value
   *
   * @example
   * ```typescript
   *
   * DateTime.of("2020-02-02")
   *   // -> 2020-02-02T00:00:00
   * DateTime.of("2020-02-02 10:10:10")
   *   // -> 2020-02-02T10:10:10
   * DateTime.of("2020/02/02")
   *   // -> 2020-02-02T00:00:00
   * DateTime.of("2020/02/02 20:20:20")
   *   // -> 2020-02-02T20:20:20
   */
  static of(value: string): DateTime {
    return new DateTime(dayjs(value));
  }

  /**
   * Create instance of now.
   */
  static now(): DateTime {
    return new DateTime(dayjs());
  }

  /**
   * Create instance of today
   *
   * @example
   * ```typescript
   * // Now: 2020-01-01 23:03:00
   * DateTime.today()
   *   // -> 2020-01-01T00:00:00
   * ```
   */
  static today(): DateTime {
    return new DateTime(dayjs().startOf("day"));
  }

  /**
   * Create instance of yesterday
   *
   * @example
   * ```typescript
   * // Now: 2020-01-01 23:03:00
   * DateTime.yesterday()
   *   // -> 2019-12-31T00:00:00
   * ```
   */
  static yesterday(): DateTime {
    return DateTime.today().minusDays(1);
  }

  /**
   * Create instance of today
   *
   * @example
   * ```typescript
   * // Now: 2020-01-01 23:03:00
   * DateTime.tomorrow()
   *   // -> 2020-01-02T00:00:00
   * ```
   */
  static tomorrow(): DateTime {
    return DateTime.today().plusDays(1);
  }

  /**
   * Check whether the format is valid or not.
   * @param value
   * @param format
   *
   * @example
   * ```typescript
   * DateTime.isValid("2020-01-01", "YYYY-MM-DD")
   *   // -> true
   * DateTime.isValid("2020-01-01", "YYYY/MM/DD")
   *   // -> false
   * DateTime.isValid("2020-01-31", "YYYY-MM-DD")
   *   // -> false
   * ```
   */
  static isValid(value: string, format: string): boolean {
    return dayjs(value, format).format(format) === value;
  }

  /**
   * Clone a instance
   */
  clone(): DateTime {
    return new DateTime(this._value.clone());
  }

  /**
   * @param days
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").plusDays(3)
   *   // -> 2020-01-04T10:00:00
   * ```
   */
  plusDays(days: number): DateTime {
    return new DateTime(this._value.add(days, "day"));
  }

  /**
   * @param weekdays
   *
   * @example 2020-12-01(Tue) - 2020-12-07(Mon). 2020-12-02 is a holiday!
   * ```typescript
   * DateTime.setHolidays("2020-12-02");
   *
   * DateTime.of("2020-12-01 00:00:00").plusWeekdays(2)
   *   // -> 2020-12-04T00:00:00
   * DateTime.of("2020-12-03 00:00:00").plusWeekdays(3)
   *   // -> 2020-12-08T00:00:00
   * ```
   */
  plusWeekdays(weekdays: number): DateTime {
    let d = this.clone();
    while (weekdays > 0) {
      d = d.plusDays(1);
      if (d.isWeekday) {
        weekdays--;
      }
    }
    return d;
  }

  /**
   * @param hours
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").plusHours(3)
   *   // -> 2020-01-01T13:00:00
   * ```
   */
  plusHours(hours: number): DateTime {
    return new DateTime(this._value.add(hours, "hour"));
  }

  /**
   * @param minutes
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").plusMinutes(3)
   *   // -> 2020-01-01T10:03:00
   * ```
   */
  plusMinutes(minutes: number): DateTime {
    return new DateTime(this._value.add(minutes, "minute"));
  }

  /**
   * @param seconds
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").plusSeconds(3)
   *   // -> 2020-01-01T10:00:03
   * ```
   */
  plusSeconds(seconds: number): DateTime {
    return new DateTime(this._value.add(seconds, "second"));
  }

  /**
   * @param days
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").minusDays(3)
   *   // -> 2019-12-29T10:00:00
   * ```
   */
  minusDays(days: number): DateTime {
    return new DateTime(this._value.subtract(days, "day"));
  }

  /**
   * @param hours
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").minusHours(3)
   *   // -> 2020-01-01T07:00:00
   * ```
   */
  minusHours(hours: number): DateTime {
    return new DateTime(this._value.subtract(hours, "hour"));
  }

  /**
   * @param minutes
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").minusMinutes(3)
   *   // -> 2020-01-01T09:57:00
   * ```
   */
  minusMinutes(minutes: number): DateTime {
    return new DateTime(this._value.subtract(minutes, "minute"));
  }

  /**
   * @param seconds
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00").minusSeconds(3)
   *   // -> 2020-01-01T09:59:57
   * ```
   */
  minusSeconds(seconds: number): DateTime {
    return new DateTime(this._value.subtract(seconds, "second"));
  }

  /**
   * Only overwrite year, month, and date.
   * @param date
   *
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 10:00:00")
   *   .overwriteDate("2020-02-02 17:00:00")
   *     // -> 2020-02-02T10:00:00
   * ```
   */
  overwriteDate(date: DateTime): DateTime {
    return new DateTime(
      this._value
        .year(date._value.year())
        .month(date._value.month())
        .date(date._value.date())
    );
  }

  diffMinutesFromNow(): number {
    return DateTime.now()._value.diff(this._value, "minute");
  }

  diffSecondsFromNow(): number {
    return DateTime.now()._value.diff(this._value, "second");
  }

  /**
   * HH:mm:ss (ex: 10:50:01)
   */
  displayDiffFromNow(): string {
    return toHHmmss(DateTime.now()._value.diff(this._value, "second"));
  }

  /**
   * ex
   *   00:00:48 -> 48秒
   *   00:02:11 -> 2分 (Ignore seconds in the case seconds >= 60)
   */
  displayDiffFromNowJapanese(): string {
    const hours = this._value.hour();
    const minutes = this._value.minute();
    const seconds = this._value.second();
    return [
      hours && `${hours}時間`,
      minutes && `${minutes}分`,
      hours === 0 && minutes === 0 && `${seconds}秒`,
    ]
      .filter((x) => x)
      .join("");
  }

  within(seconds: number): boolean {
    return DateTime.now()._value.diff(this._value, "second") <= seconds;
  }

  equals(date: DateTime, ignoreTime = false): boolean {
    return ignoreTime
      ? this._value.isSame(date._value, "date")
      : this._value.isSame(date._value);
  }

  isAfter(date: DateTime, ignoreTime = false): boolean {
    return ignoreTime
      ? this._value.isAfter(date._value, "date")
      : this._value.isAfter(date._value);
  }

  isBefore(date: DateTime, ignoreTime = false): boolean {
    return ignoreTime
      ? this._value.isBefore(date._value, "date")
      : this._value.isBefore(date._value);
  }

  isAfterOrEquals(date: DateTime, ignoreTime = false): boolean {
    return this.isAfter(date, ignoreTime) || this.equals(date, ignoreTime);
  }

  isBeforeOrEquals(date: DateTime, ignoreTime = false): boolean {
    return this.isBefore(date, ignoreTime) || this.equals(date, ignoreTime);
  }

  between(
    begin: DateTime,
    end: DateTime,
    option = { includeBegin: true, includeEnd: true, ignoreTime: false }
  ): boolean {
    return (
      (option.includeBegin
        ? this.isAfterOrEquals(begin, option.ignoreTime)
        : this.isAfter(begin, option.ignoreTime)) &&
      (option.includeEnd
        ? this.isBeforeOrEquals(end, option.ignoreTime)
        : this.isBefore(end, option.ignoreTime))
    );
  }

  get isStartOfDay(): boolean {
    return this._value.startOf("day").isSame(this._value);
  }

  /**
   * @example 2020-12-04(Fri), 2020-12-05(Sat), 2020-12-06(Sun)
   * ```typescript
   * DateTime.of("2020-12-04 00:00:00").isSunday
   *   // -> false
   * DateTime.of("2020-12-05 10:00:00").isSunday
   *   // -> true
   * DateTime.of("2020-12-06 23:59:59").isSunday
   *   // -> false
   * ```
   */
  get isSaturday(): boolean {
    // TODO: Remove a magic number
    return this._value.day() === 6;
  }

  /**
   * @example 2020-12-04(Fri), 2020-12-05(Sat), 2020-12-06(Sun)
   * ```typescript
   * DateTime.of("2020-12-04 00:00:00").isSunday
   *   // -> false
   * DateTime.of("2020-12-05 10:00:00").isSunday
   *   // -> false
   * DateTime.of("2020-12-06 23:59:59").isSunday
   *   // -> true
   * ```
   */
  get isSunday(): boolean {
    // TODO: Remove a magic number
    return this._value.day() === 0;
  }

  /**
   * @example
   * ```typescript
   * DateTime.setHolidays("2020-07-07", "2020-12-24")
   *
   * DateTime.of("2020-01-01 00:00:00").isHoliday
   *   // -> false
   * DateTime.of("2020-07-07 10:00:00").isHoliday
   *   // -> true
   * DateTime.of("2020-12-24 23:59:59").isHoliday
   *   // -> true
   * ```
   */
  get isHoliday(): boolean {
    return !!DateTime.holidayByDisplayDate[this.displayDate];
  }

  /**
   * @example 2020-12-01(Tue) - 2020-12-07(Mon). 2020-12-02 is a holiday!
   * ```typescript
   * DateTime.setHolidays("2020-12-02");
   *
   * DateTime.of("2020-12-01 00:00:00").isWeekday
   *   // -> true
   * DateTime.of("2020-12-02 03:00:00").isWeekday
   *   // -> false
   * DateTime.of("2020-12-03 06:00:00").isWeekday
   *   // -> true
   * DateTime.of("2020-12-04 09:00:00").isWeekday
   *   // -> true
   * DateTime.of("2020-12-05 12:00:00").isWeekday
   *   // -> false
   * DateTime.of("2020-12-06 15:00:00").isWeekday
   *   // -> false
   * DateTime.of("2020-12-07 18:00:00").isWeekday
   *   // -> true
   * ```
   */
  get isWeekday(): boolean {
    return !(this.isSaturday || this.isSunday || this.isHoliday);
  }

  /**
   * @example
   * ```typescript
   * DateTime.of("2020-01-01 00:01:30").date
   *   // -> equals to new Date(2020, 0, 1, 0, 1, 30, 0)
   * ```
   */
  get date(): Date {
    return this._value.toDate();
  }

  /**
   * ex: 1970-01-01 00:01:30 -> 90
   */
  get unix(): number {
    return this._value.unix();
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 2020-10-02T08:23:01+00:00
   */
  get rfc3339(): string {
    return this._value.format("YYYY-MM-DDTHH:mm:ssZ");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 2020-10-02T08:23:01
   */
  get rfc3339WithoutTimezone(): string {
    return this._value.format("YYYY-MM-DDTHH:mm:ss");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 08:23:01
   */
  get displayTime(): string {
    return this._value.format("HH:mm:ss");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 08:23
   */
  get displayTimeWithoutSeconds(): string {
    return this._value.format("HH:mm");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 2020-10-02
   */
  get displayDate(): string {
    return this._value.format("YYYY-MM-DD");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 2020-10-02 (Fri)
   */
  get displayDateFull(): string {
    return this._value.format("YYYY-MM-DD (ddd)");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 2020-10-02 08:23:01
   */
  get displayDateTime(): string {
    return this._value.format("YYYY-MM-DD HH:mm:ss");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 2020-10-02 08:23
   */
  get displayDateTimeWithoutSeconds(): string {
    return this._value.format("YYYY-MM-DD HH:mm");
  }

  /**
   * ex: 2020-10-02 08:23:01 -> 20201002082301
   */
  get yyyyMMddHHmmss(): string {
    return this._value.format("YYYYMMDDHHmmss");
  }
}
