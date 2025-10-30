import React from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'

// --- Chains (solo Sepolia) ---
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: (chain) =>
        chain.id === sepolia.id
          ? { http: process.env.REACT_APP_RPC_SEPOLIA || 'https://1rpc.io/sepolia' }
          : null,
    }),
    publicProvider(),
  ],
)

// --- Conectores (SOLO MetaMask) ---
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        chains,
        shimDisconnect: true,
        projectId: process.env.REACT_APP_WC_PROJECT_ID,
      }),
    ],
  },
])

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export default function WalletProvider({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme()}
        initialChain={sepolia}
        modalSize="compact"
        appInfo={{ appName: 'Bet Poker' }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
