type EntityId = string | number;

export abstract class Entity<T> {
  readonly #id: EntityId;
  protected _props: T;

  protected constructor(id: EntityId, props: T) {
    this.#id = id;
    this._props = props;
  }

  equals(entity?: Entity<T>): boolean {
    return entity == null ? false : this.#id === entity.#id;
  }
}
