==> for-each.js <==
function forEach(items, callback) {
  for(let i=0; i<items.length; i++) {
    callback(items[i]);
  }
}

module.exports = forEach;

==> test/for-each.test.js <==
const forEach = require('../for-each');

describe('forEach function test', () => {
  it('mock callback function', ()=>{
    const cb = jest.fn(x => x+20);
    forEach([0, 1], cb);

    expect(cb.mock.calls.length).toBe(2);
    expect(cb.mock.calls[0][0]).toBe(0);
    expect(cb.mock.calls[1][0]).toBe(1);
    expect(cb.mock.results[0].value).toBe(20);
    expect(cb.mock.results[1].value).toBe(21);
  });
});

==> password-rules.js <==
const oneUpperCaseRule = (input) => {
  return {
    passed: (input.toLowerCase() !== input),
    reason: 'at least one upper case needed'
  };
};

module.exports = { oneUpperCaseRule };

==> test/password-rules.test.js <==
const { oneUpperCaseRule } = require('../password-rules.js');

describe('verifyPasswordRule: oneUpperCaseRule', () => {
  test('one upper case', () => {
    const res = oneUpperCaseRule('aBc');
    expect(res.passed).toBeTruthy();
  });

  test('no upper case', () => {
    const res = oneUpperCaseRule('xyz');
    expect(res.passed).toBeFalsy();
  });

  test('all upper case', () => {
    const res = oneUpperCaseRule('OPQ');
    expect(res.passed).toBeTruthy();
  });
});

==> password-verify.js <==
const verifyPassword = (input, rules) => {
  const errors = [];
  rules.forEach(rule => {
    const result = rule(input);
    if (!result.passed) {
      errors.push(`error ${result.reason}`);
    }
  });
  return errors;
};

module.exports = {
  verifyPassword
};

==> test/password-verify.test.js <==
const { verifyPassword } = require('../password-verify.js');

describe('verifyPassword', () => {
  test('given a failing rule, returns errors', () => {
    const fakeRule = input => ({ passed: false, reason: 'fake reason' });
    const errs = verifyPassword('abc', [fakeRule]);
    expect(errs[0]).toBe('error fake reason');
  });
});

describe('verifyPassword with jest mock', () => {
  test('given a failing rule, returns errors', () => {
    const fakeRule = jest.fn(input => { return { 'passed': false, 'reason': 'fake reason' }} );

    const errs = verifyPassword('abc', [fakeRule]);
    expect(errs[0]).toBe('error fake reason');
  });
});
