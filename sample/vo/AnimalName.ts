declare const _brand: unique symbol;
// biome-ignore lint/suspicious/noConfusingVoidType: reduce risk for bug
export type AnimalName = string & { [_brand]: void };
