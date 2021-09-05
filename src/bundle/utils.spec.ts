import { isEmpty, round } from "./utils";

describe.each`
  n          | decimalPlace | expected
  ${34.5678} | ${2}         | ${34.57}
  ${0.1234}  | ${1}         | ${0.1}
`("round", ({ n, decimalPlace, expected }) => {
  test(`round(${n}, ${decimalPlace}) = ${expected}`, () => {
    expect(round(n, decimalPlace)).toBe(expected);
  });
});

describe.each`
  n                   | expected
  ${0}                | ${true}
  ${1}                | ${false}
  ${-1}               | ${false}
  ${""}               | ${true}
  ${" "}              | ${false}
  ${"a"}              | ${false}
  ${{}}               | ${true}
  ${{ a: undefined }} | ${false}
  ${[]}               | ${true}
  ${[""]}             | ${false}
  ${undefined}        | ${true}
  ${null}             | ${true}
`("isEmpty", ({ n, expected }) => {
  test(`isEmpty(${n}) = ${expected}`, () => {
    expect(isEmpty(n)).toBe(expected);
  });
});
