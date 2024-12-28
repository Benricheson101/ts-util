import assert from 'node:assert';
import type {Assertion} from './util';

export declare const BrandKey: unique symbol;
export declare const TypeKey: unique symbol;

/**
 * A branded type is a primitive type with an extra piece of metadata attached to it to
 * differentiate it from other primitives of the same type. This can be used to enable
 * more strict validation and type-safe code.
 *
 * @example
 * ```ts
 * type Username = Brand<string, 'username'>;
 * type Password = Brand<string, 'password'>;
 *
 * declare const myUsername: Username;
 * declare const myPassword: Password;
 *
 * declare function displayUsername(username: Username);
 *
 * displayUsername(myUsername);
 * displayUsername(myPassword); // type error
 * ```
 */
export type Brand<T, B> = T & {readonly [BrandKey]: B; readonly [TypeKey]: T};
/** A catch-all "any" Brand type */
export type UnknownBrand = Brand<unknown, unknown>;

/** Extracts the base type from a branded type */
export type Identify<B extends UnknownBrand> = B[typeof TypeKey];

/** Extracts the brand type from a branded type */
export type BrandType<B extends UnknownBrand> = B[typeof BrandKey];

/** Casts a concrete type to a branded type */
export const brand = <B extends UnknownBrand>(v: Identify<B>) => v as B;
export type Brander<B extends UnknownBrand> = typeof brand<B>;

/** Downcasts a branded type to its concrete type */
export const identify = <B extends UnknownBrand>(b: B): Identify<B> => b;

export type BrandAssertion<B extends UnknownBrand> = Assertion<Identify<B>, B>;

/**
 * Creates a factory for creating branded types. The optional assertion function should
 * either return `true` or `void` to signify a valid entry (and allow branding to proceed),
 * or `false` or throw to denote invalid brand compliance.
 * @example
 * ```ts
 * type Password = Brand<string, 'password'>;
 * // password must be 5+ characters and contain a number
 * const password = make<Password>(p => p.length >= 5 && /[0-9]/.test(p));
 * ```
 */
export const make =
  <B extends UnknownBrand>(f: BrandAssertion<B> = () => true): Brander<B> =>
  v => {
    assert(f(v) ?? true);
    return brand<B>(v);
  };
