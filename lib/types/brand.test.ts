import {equal, throws} from 'node:assert';
import {describe, it} from 'node:test';

import {type Brand, identify, make} from './brand';

declare const UsernameTag: unique symbol;
type Username = Brand<string, typeof UsernameTag>;

declare const PasswordTag: unique symbol;
type Password = Brand<string, typeof PasswordTag>;

const takesUsername = (_u: Username): void => {};
const takesPassword = (_p: Password): void => {};

describe('type/brand', () => {
  it('should create a branded type', () => {
    const username = make<Username>();
    const password = make<Password>(
      p =>
        p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p)
    );

    const user = username('ben');
    const pass = password('aaaBBB333');

    throws(() => password('this is an invalid password'));

    takesUsername(user);
    takesPassword(pass);

    // @ts-expect-error not a branded type
    takesUsername('ben');
    // @ts-expect-error not a branded type
    takesPassword('aaaBBB333');

    // @ts-expect-error incorrect branded type
    takesUsername(pass);
    // @ts-expect-error not a branded type
    takesPassword(user);

    const userI = identify(user);
    const passI = identify(pass);
    equal(typeof userI, 'string');
    equal(typeof passI, 'string');
  });
});
