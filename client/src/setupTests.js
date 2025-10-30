import '@testing-library/jest-dom'


if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
  }
}


if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder
}


globalThis.crypto = {
  getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
};


const originalMathPow = Math.pow;
Math.pow = function patchedPow(base, exponent) {
  const isBigInt = typeof base === 'bigint' || typeof exponent === 'bigint';
  if (isBigInt) {
    try {
      const result = BigInt(base) ** BigInt(exponent); 
      return Number(result); 
    } catch (e) {
      return NaN; 
    }
  }
  return originalMathPow(base, exponent); 
};