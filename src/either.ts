class Left<E, T> {
  private _type = "left" as const;
  constructor(public error: E) {}

  isLeft(): this is Left<E, T> {
    return true;
  }
  isRight(): this is Right<E, T> {
    return false;
  }
  get _left(): E | undefined {
    return this.error;
  }
  get _right(): T | undefined {
    return undefined;
  }
  mapLeft<ER>(functor: (err: E) => ER): Either<ER, T> {
    return new Left(functor(this.error));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapRight<TR>(functor: (value: T) => TR): Either<E, TR> {
    return new Left(this.error);
  }

  or(value: T): T {
    return value
  }
  orThrow(): T {
    throw this.error;
  }
}

class Right<E, T> {
  private _type = "right" as const;
  constructor(public value: T) {}

  isLeft(): this is Left<E, T> {
    return false;
  }
  isRight(): this is Right<E, T> {
    return true;
  }
  get _left(): E | undefined {
    return undefined;
  }
  get _right(): T | undefined {
    return this.value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapLeft<ER>(functor: (err: E) => ER): Either<ER, T> {
    return new Right(this.value);
  }
  mapRight<TR>(functor: (value: T) => TR): Either<E, TR> {
    return new Right(functor(this.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  or(value: T): T {
    return this.value
  }
  orThrow(): T {
    return this.value;
  }
}

export type Either<E, T> = Left<E, T> | Right<E, T>;

export const left = <E, T>(error: E): Left<E, T> => new Left(error);
export const right = <E, T>(value: T): Right<E, T> => new Right(value);

export function aggregate<E, T>(eithers: Either<E[], T>[]): Either<E[], T[]> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const errors = eithers.filter((x) => x.isLeft()).flatMap((x) => x._left!);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const values = eithers.filter((x) => x.isRight()).map((x) => x._right!);

  return errors.length > 0 ? left(errors) : right(values);
}
