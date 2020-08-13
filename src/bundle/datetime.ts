import { ValueObject } from "../vo";
import dayjs from "dayjs";
import "dayjs/locale/ja";

const pad00 = (v: number): string => String(v).padStart(2, "0");

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

  static of(value: string): DateTime {
    return new DateTime(dayjs(value));
  }

  static now(): DateTime {
    return new DateTime(dayjs());
  }

  static today(): DateTime {
    return new DateTime(dayjs().startOf("day"));
  }

  static yesterday(): DateTime {
    return DateTime.today().minusDays(1);
  }

  static tomorrow(): DateTime {
    return DateTime.today().plusDays(1);
  }

  plusDays(days: number): DateTime {
    return new DateTime(this._value.add(days, "day"));
  }

  plusHours(hours: number): DateTime {
    return new DateTime(this._value.add(hours, "hour"));
  }

  plusMinutes(minutes: number): DateTime {
    return new DateTime(this._value.add(minutes, "minute"));
  }

  plusSeconds(seconds: number): DateTime {
    return new DateTime(this._value.add(seconds, "second"));
  }

  minusDays(days: number): DateTime {
    return new DateTime(this._value.subtract(days, "day"));
  }

  minusHours(hours: number): DateTime {
    return new DateTime(this._value.subtract(hours, "hour"));
  }

  minusMinutes(minutes: number): DateTime {
    return new DateTime(this._value.subtract(minutes, "minute"));
  }

  minusSeconds(seconds: number): DateTime {
    return new DateTime(this._value.subtract(seconds, "second"));
  }

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
