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


// --- hard-purge de sesiones WC v2 / wagmi (en arranque) ---
(function hardPurgeWC() {
  try {
    // local/session
    Object.keys(localStorage).forEach(k => {
      if (/^wc@|walletconnect|WALLETCONNECT|wagmi\./i.test(k)) localStorage.removeItem(k)
    })
    Object.keys(sessionStorage).forEach(k => {
      if (/^wc@|walletconnect|WALLETCONNECT|wagmi\./i.test(k)) sessionStorage.removeItem(k)
    })

    // indexedDB (WC v2 usa varias DBs)
    const del = (name) => { try { indexedDB.deleteDatabase(name) } catch (_) { } }
    del('walletconnect'); del('WalletConnect'); del('WalletConnectV2'); del('wagmi')

    // algunos navegadores soportan listar DBs
    if (indexedDB.databases) {
      indexedDB.databases().then(dbs => {
        (dbs || []).forEach(db => {
          if (!db?.name) return
          if (/walletconnect|wagmi/i.test(db.name)) indexedDB.deleteDatabase(db.name)
        })
      })
    }
  } catch (_) { }
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

window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event.reason || '')
  if (msg.includes('isValidUpdate') || msg.includes('Cannot convert undefined or null to object')) {
    console.warn('🟡 Ignorado: stale session de WalletConnect/SignClient.')
    event.preventDefault()
  }
})



if (
  process.env.NODE_ENV === 'production' &&
  typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object'
) {
  for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] =
      typeof value === 'function' ? () => { } : null;
  }
}
