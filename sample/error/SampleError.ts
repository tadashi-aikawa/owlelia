import { BaseError } from "../../src";

export class SampleError extends BaseError {}

export class InvalidSpotIdError extends SampleError {}
export class UnexpectedError extends SampleError {}
