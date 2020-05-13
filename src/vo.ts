interface ValueObjectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}

const deepEqual = (a: unknown, b: unknown): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export abstract class AbstractValueObject<T> {
  protected readonly _value: T;

  protected constructor(_value: T) {
    this._value = Object.freeze(_value);
  }

  equals(vo?: AbstractValueObject<T>): boolean {
    return vo == null ? false : deepEqual(this._value, vo._value);
  }
}

export abstract class ValueObject<
  T extends ValueObjectProps
> extends AbstractValueObject<T> {}

export abstract class PrimitiveValueObject<T> extends AbstractValueObject<T> {
  unwrap(): T {
    return this._value;
  }
}
