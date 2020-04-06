import { Either, isRight, left, right, isLeft } from "fp-ts/lib/Either";
import { lefts, rights } from "fp-ts/lib/Array";

export function foldEithers<E, A>(eithers: Either<E[], A>[]): Either<E[], A[]> {
  const leftArray = lefts(eithers);
  return leftArray.length > 0 ? left(leftArray.flat()) : right(rights(eithers));
}

export function pickRight<E, A>(x: Either<E, A>): A | undefined {
  return isRight(x) ? x.right : undefined;
}

export function forceRight<E, A>(x: Either<E, A>): A {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return pickRight(x)!;
}

export function pickLeft<E, A>(x: Either<E, A>): E | undefined {
  return isLeft(x) ? x.left : undefined;
}

export function forceLeft<E, A>(x: Either<E, A>): E {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return pickLeft(x)!;
}
