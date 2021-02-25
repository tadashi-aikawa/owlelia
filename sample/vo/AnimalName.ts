declare const _brand: unique symbol;
export type AnimalName = string & { [_brand]: void };
