class Ok<T, E> {
  private _type = "ok" as const;
  constructor(public value: T) {}

  isErr(): this is Err<T, E> {
    return false;
  }
  isOk(): this is Ok<T, E> {
    return true;
  }
  get _err(): E | undefined {
    return undefined;
  }
  get _ok(): T | undefined {
    return this.value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapErr<ER>(functor: (err: E) => ER): Result<T, ER> {
    return new Ok(this.value);
  }
  map<TR>(functor: (value: T) => TR): Result<TR, E> {
    return new Ok(functor(this.value));
  }
  biMap<TR, ER>(
    functor: (value: T) => TR,
    errFunctor: (err: E) => ER
  ): Result<TR, ER> {
    return this.mapErr(errFunctor).map(functor);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  or(value: T): T {
    return this.value;
  }
  orUndefined(): T | undefined {
    return this.value;
  }
  orNull(): T | null {
    return this.value;
  }
  orThrow(): T {
    return this.value;
  }
}

class Err<T, E> {
  private _type = "err" as const;
  constructor(public error: E) {}

  isErr(): this is Err<T, E> {
    return true;
  }
  isOk(): this is Ok<T, E> {
    return false;
  }
  get _err(): E | undefined {
    return this.error;
  }
  get _ok(): T | undefined {
    return undefined;
  }
  mapErr<ER>(functor: (err: E) => ER): Result<T, ER> {
    return new Err(functor(this.error));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<TR>(functor: (value: T) => TR): Result<TR, E> {
    return new Err(this.error);
  }
  biMap<TR, ER>(
    functor: (value: T) => TR,
    errFunctor: (err: E) => ER
  ): Result<TR, ER> {
    return this.mapErr(errFunctor).map(functor);
  }

  or(value: T): T {
    return value;
  }
  orUndefined(): T | undefined {
    return undefined;
  }
  orNull(): T | null {
    return null;
  }
  orThrow(): T {
    throw this.error;
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export type AsyncResult<T, E> = Promise<Result<T, E>>;
export type Nullable<T> = T | undefined | null;
export type AsyncNullable<T> = Promise<Nullable<T>>;

export const err = <T, E>(error: E): Err<T, E> => new Err(error);
export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);

export function aggregate<T, E>(results: Result<T, E[]>[]): Result<T[], E[]> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const errors = results.filter((x) => x.isErr()).flatMap((x) => x._err!);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const values = results.filter((x) => x.isOk()).map((x) => x._ok!);

  return errors.length > 0 ? err(errors) : ok(values);
}
