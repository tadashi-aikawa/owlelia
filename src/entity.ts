type EntityId = string | number;

export abstract class Entity<T> {
  private readonly _id: EntityId;
  protected _props: T;

  protected constructor(id: EntityId, props: T) {
    this._id = id;
    this._props = props;
  }

  equals(entity?: Entity<T>): boolean {
    return entity == null ? false : this._id === entity._id;
  }
}
