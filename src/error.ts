export class BaseError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }

  to<T extends Error>(clazz: { new (message?: string): T }): T {
    return new clazz(this.message);
  }
}
