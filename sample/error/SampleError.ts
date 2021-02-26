import { BaseError } from "../../src";

export class SampleError extends BaseError {}

const _invalidSpotIdBrand = Symbol();
export class InvalidSpotIdError extends SampleError {
  private [_invalidSpotIdBrand]: void;
}

const _unexpectedBrand = Symbol();
export class UnexpectedError extends SampleError {
  private [_unexpectedBrand]: void;
}
