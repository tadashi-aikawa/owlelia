import { ValueObject } from "../vo";
import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

/**
 * HH:mm:ss -> seconds
 * ex
 *   00:02:11 -> 131
 * @param time
 */
function toSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 60 * 60 + minutes * 60 + seconds;
}

const pad00 = (v: number) => String(v).padStart(2, "0");

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

/**
 * HH:mm:ss -> Japanese format
 * ex
 *   00:00:48 -> 48秒
 *   00:02:11 -> 2分 (Ignore seconds in the case seconds >= 60)
 * @param time
 */
function toJapanese(time: string): string {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return [
    hours && `${hours}時間`,
    minutes && `${minutes}分`,
    hours === 0 && minutes === 0 && `${seconds}秒`,
  ]
    .filter((x) => x)
    .join("");
}

/**
 * seconds -> Japanese format
 * ex
 *   48 -> 48秒
 *   131 -> 2分 (Ignore seconds in the case seconds >= 60)
 * @param format
 */
function toJapaneseFromSecond(seconds: number): string {
  return toJapanese(toHHmmss(seconds));
}

export class DateTime extends ValueObject<dayjs.Dayjs> {
  private _owleliaVoCommonDateTimeBrand!: never;

  static of(value: string): DateTime {
    return new DateTime(dayjs(value));
  }

  static now(): DateTime {
    return new DateTime(dayjs());
  }

  static yesterday(): DateTime {
    return DateTime.now().minusDays(1);
  }

  static tomorrow(): DateTime {
    return DateTime.now().plusDays(1);
  }

  plusDays(days: number): DateTime {
    return new DateTime(this._value.add(days, "day"));
  }

  plusSeconds(seconds: number): DateTime {
    return new DateTime(this._value.add(seconds, "second"));
  }

  minusDays(days: number): DateTime {
    return new DateTime(this._value.subtract(days, "day"));
  }

  minusMinutes(minutes: number): DateTime {
    return new DateTime(this._value.subtract(minutes, "minute"));
  }

  displayDiffFromNow(): string {
    return toHHmmss(dayjs().diff(this._value, "second"));
  }

  within(seconds: number): boolean {
    return dayjs().diff(this._value, "second") <= seconds;
  }

  equalsAsDate(dateTime: DateTime): boolean {
    return this._value.isSame(dateTime._value, "day");
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

  get unix(): number {
    return this._value.unix();
  }

  get rfc3339(): string {
    return this._value.format("YYYY-MM-DDTHH:mm:ssZ");
  }

  get displayTime(): string {
    return this._value.format("HH:mm:ss");
  }

  get displayTimeWithoutSeconds(): string {
    return this._value.format("HH:mm");
  }

  get displayDate(): string {
    return this._value.format("YYYY-MM-DD");
  }

  get displayDateFull(): string {
    return this._value.format("YYYY-MM-DD (ddd)");
  }

  get displayDateTime(): string {
    return this._value.format("YYYY-MM-DD HH:mm:ss");
  }

  get displayDateTimeWithoutSeconds(): string {
    return this._value.format("YYYY-MM-DD HH:mm");
  }
}
