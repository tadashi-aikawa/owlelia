/**
 * @example
 * ```typescript
 * round(34.5678, 2)
 *   // -> 34.56
 * round(0.1234, 1)
 *   // -> 0.1
 * ```
 */
export function round(n: number, decimalPlace: number): number {
  const x = 10 ** decimalPlace;
  return Math.round(n * x) / x;
}

/**
 * @example
 * ```typescript
 * isEmpty(0) // -> true
 * isEmpty(1) // -> false
 * isEmpty(-1) // -> false
 * isEmpty("") // -> true
 * isEmpty(" ") // -> false
 * isEmpty("a") // -> false
 * isEmpty({}) // -> true
 * isEmpty({a: undefined}) // -> false
 * isEmpty([]) // -> true
 * isEmpty([""]) // -> false
 * isEmpty(undefined) // -> true
 * isEmpty(null) // -> true
 * ```
 */
export function isEmpty(arg: any): boolean {
  return (
    [Object, Array].includes((arg || {}).constructor) &&
    !Object.entries(arg || {}).length
  );
}
