import { getWalletClient } from '@wagmi/core'
import { sepolia } from 'wagmi/chains'

export async function getWalletClientSafe(config, maxRetries = 6) {
  let tries = 0, client
  while (!client && tries < maxRetries) {
    try {
      client = await getWalletClient(config, { chainId: sepolia.id })
    } catch (_) {
      await new Promise(r => setTimeout(r, 400))
    }
    tries++
  }
  if (!client) throw new Error('Wallet client not ready after retries')
  return client
}
