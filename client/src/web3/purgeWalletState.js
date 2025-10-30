import { disconnect } from '@wagmi/core'
import { wagmiConfig } from './wagmiConfig'

export async function purgeWalletState() {
  try { await disconnect(wagmiConfig) } catch (_) {}

  try {
    Object.keys(localStorage).forEach(k => {
      if (/^wc@|walletconnect|WALLETCONNECT|wagmi\./i.test(k)) localStorage.removeItem(k)
    })
    Object.keys(sessionStorage).forEach(k => {
      if (/^wc@|walletconnect|WALLETCONNECT|wagmi\./i.test(k)) sessionStorage.removeItem(k)
    })
    // limpiar posibles DBs
    ;['walletconnect','WalletConnect','WalletConnectV2','wagmi']
      .forEach(name => { try { indexedDB.deleteDatabase(name) } catch {} })
  } catch {}
}
