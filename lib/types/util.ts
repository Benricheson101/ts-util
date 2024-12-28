export type Assert<A, _ extends A> = A;
export type Cast<A, T = number> = A extends T ? A : never;

export type Assertion<A, B extends A> = (v: A) => asserts v is B;
