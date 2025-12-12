import { BaseError } from "../../src";

export class SampleError extends BaseError {}

const _invalidSpotIdBrand = Symbol();
export class InvalidSpotIdError extends SampleError {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
  private [_invalidSpotIdBrand]: void;
}

const _unexpectedBrand = Symbol();
export class UnexpectedError extends SampleError {
  // biome-ignore lint/suspicious/noTsIgnore: need to suppress error
  // @ts-ignore: unused private member
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: need to infer type
  // biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
  private [_unexpectedBrand]: void;
}
