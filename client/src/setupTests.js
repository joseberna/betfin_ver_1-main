import '@testing-library/jest-dom'

// Mock global crypto.getRandomValues si no está definido
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
  }
}

// ✅ Polyfill para TextEncoder y TextDecoder (necesario para viem / wagmi)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder
}

// Polyfill Math.pow to handle BigInt inputs in tests
globalThis.crypto = {
  getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
};

// Fix Math.pow with BigInt inputs to avoid Jest + wagmi/viem crash
const originalMathPow = Math.pow;
Math.pow = function patchedPow(base, exponent) {
  const isBigInt = typeof base === 'bigint' || typeof exponent === 'bigint';
  if (isBigInt) {
    try {
      const result = BigInt(base) ** BigInt(exponent); // ← No usa Math.pow
      return Number(result); // Convertir a number si se puede
    } catch (e) {
      return NaN; // fallback seguro
    }
  }
  return originalMathPow(base, exponent); // caso normal
};