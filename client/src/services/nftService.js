import { readContract, writeContract, waitForTransaction } from '@wagmi/core'
import BetfinCollectible from '../abi/BetfinCollectible.json'
import { wagmiConfig } from '../web3'

// === CONFIGURACIÓN ===
export const CONTRACT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS
export const NETWORK = 'sepolia'

export const getTxUrl = (hash) =>
  NETWORK === 'sepolia'
    ? `https://sepolia.etherscan.io/tx/${hash}`
    : `https://etherscan.io/tx/${hash}`

// === CARGAR NFTs DEL USUARIO ===
export async function loadUserNFTs(address) {
  if (!address) {
    console.warn('⚠️ No wallet address provided to loadUserNFTs')
    return []
  }

  if (!CONTRACT_ADDRESS) {
    console.error('❌ Falta REACT_APP_NFT_ADDRESS en tu archivo .env')
    return []
  }

  try {
    console.log('📦 Cargando NFTs de', address)

    const balance = await readContract({
      ...wagmiConfig,
      address: CONTRACT_ADDRESS,
      abi: BetfinCollectible.abi,
      functionName: 'balanceOf',
      args: [address],
    })

    const total = Number(balance || 0)
    console.log('🎯 Balance NFTs:', total)

    if (total === 0) return []

    const nfts = []

    for (let i = 0; i < total; i++) {
      let tokenId, meta

      try {
        tokenId = await readContract({
          ...wagmiConfig,
          address: CONTRACT_ADDRESS,
          abi: BetfinCollectible.abi,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, i],
        })

        meta = await readContract({
          ...wagmiConfig,
          address: CONTRACT_ADDRESS,
          abi: BetfinCollectible.abi,
          functionName: 'getMetadata',
          args: [tokenId],
        })
      } catch (innerErr) {
        console.warn(`⚠️ Error obteniendo NFT #${i}:`, innerErr)
        continue
      }

      nfts.push({
        tokenId: tokenId?.toString() || i.toString(),
        name: meta?.name || 'Unnamed NFT',
        description: meta?.description || '',
        rarity: Number(meta?.rarity || 0),
        tokenURI: meta?.tokenURI || '',
      })
    }

    console.log('✅ NFTs cargados:', nfts.length)
    return nfts
  } catch (err) {
    console.error('❌ Error al cargar NFTs:', err)
    return []
  }
}

// === MINT NFT ===
/**
 * Mint con reporting de estado.
 * onStatus(status, payload):
 *  - 'signing'   (mostramos “firma en wallet”)
 *  - 'submitted' ({ hash })
 *  - 'confirmed' ({ receipt })
 *  - 'failed'    ({ error })
 */
export async function mintNFT(address, form, onStatus = () => {}) {
  if (!address) throw new Error('Wallet address required')
  if (!CONTRACT_ADDRESS) throw new Error('Missing contract address')

  const rarity = Math.max(1, Math.min(100, Number(form.rarity || 1)))

  try {
    onStatus('signing')

    const tx = await writeContract({
      ...wagmiConfig,
      address: CONTRACT_ADDRESS,
      abi: BetfinCollectible.abi,
      functionName: 'safeMint',
      args: [
        form.name || 'Unnamed',
        form.description || '',
        rarity,
        form.tokenURI || '',
      ],
      account: address,
    })

    onStatus('submitted', { hash: tx.hash })

    const receipt = await waitForTransaction({
      ...wagmiConfig,
      hash: tx.hash,
    })

    if (receipt.status === 'success' || receipt.status === 1) {
      onStatus('confirmed', { receipt })
      return receipt
    }

    const error = new Error('Transaction failed')
    onStatus('failed', { error })
    throw error
  } catch (err) {
    console.error('❌ Error al mintear NFT:', err)
    onStatus('failed', { error: err })
    throw err
  }
}
