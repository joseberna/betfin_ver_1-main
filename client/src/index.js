// client/src/index.js
import 'core-js/es/map';
import 'core-js/es/set';
import 'raf/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Providers from './context/Providers';
import App from './App';

// --- Polyfills de Node para navegador ---
import { Buffer } from 'buffer';
import process from 'process/browser';
if (!window.global) window.global = window;
if (!window.process) window.process = process;
if (!window.Buffer) window.Buffer = Buffer;

(function safePurgeWalletConnectCache() {
  try {
    const keys = Object.keys(localStorage || {});
    for (const k of keys) {
      if (
        k.startsWith('wc@') ||
        k.startsWith('walletconnect') ||
        k.startsWith('WALLETCONNECT') ||
        k.startsWith('wagmi.store')
      ) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) {
    
    console.warn('WalletConnect cache purge skipped:', e?.message || e);
  }
})();

const rootElement = document.getElementById('root');


ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  rootElement
);


window.onload = () => {
  if (rootElement) rootElement.style.display = 'block';
};


if (
  process.env.NODE_ENV === 'production' &&
  typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object'
) {
  for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] =
      typeof value === 'function' ? () => {} : null;
  }
}
