// client/src/web3/wagmiConfig.js
import { createConfig, http, createStorage, cookieStorage } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  ssr: false,
  chains: [sepolia],
  connectors: [
    injected({
      shimDisconnect: true,   // recuerda el disconnect y evita sesiones fantasma
    }),
  ],
  storage: createStorage({
    storage:
      typeof window !== 'undefined'
        ? window.localStorage
        : cookieStorage,
  }),
  transports: {
    [sepolia.id]: http(process.env.REACT_APP_RPC_SEPOLIA || 'https://1rpc.io/sepolia'),
  },
})
