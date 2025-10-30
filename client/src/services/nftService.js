import { readContract, writeContract, waitForTransaction } from '@wagmi/core'
import { sepolia } from 'wagmi/chains'
import BetfinCollectible from '../abi/BetfinCollectible.json'
import { wagmiConfig } from '../web3/wagmiConfig'
import { getWalletClientSafe } from '../web3/getWalletClientSafe'

export const CONTRACT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS
export const NETWORK = 'sepolia'

export const getTxUrl = (hash) =>
  NETWORK === 'sepolia'
    ? `https://sepolia.etherscan.io/tx/${hash}`
    : `https://etherscan.io/tx/${hash}`


const ABI = Array.isArray(BetfinCollectible)
  ? BetfinCollectible
  : BetfinCollectible.abi
if (!ABI || ABI.length === 0) throw new Error('ABI inválido o vacío')


export async function loadUserNFTs(address) {
  if (!address) return []
  if (!CONTRACT_ADDRESS) { console.error('Falta REACT_APP_NFT_ADDRESS'); return [] }

  try {
    console.log('📦 Cargando NFTs de', address)


    const balance = await readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'balanceOf',
      args: [address],
      chainId: sepolia.id,
    })


    const total = Number(balance || 0)
    console.log('🎯 Balance NFTs:', total)
    if (total === 0) return []

    const nfts = []
    for (let i = 0; i < total; i++) {
      try {
        const tokenId = await readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, i],
          chainId: sepolia.id,
        })

        const meta = await readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'getMetadata',
          args: [tokenId],
          chainId: sepolia.id,
        })

        nfts.push({
          tokenId: tokenId?.toString() ?? `${i}`,
          name: meta?.name ?? 'Unnamed NFT',
          description: meta?.description ?? '',
          rarity: Number(meta?.rarity ?? 0),
          tokenURI: meta?.tokenURI ?? '',
        })
      } catch (e) {
        console.warn(`⚠️ Error NFT #${i}:`, e)
      }
    }

    console.log('✅ NFTs cargados:', nfts.length)
    return nfts
  } catch (err) {
    console.error('❌ Error al cargar NFTs:', err)
    return []
  }
}

export async function mintNFT(address, form, onStatus = () => { }) {
  if (!address) throw new Error('Wallet address required')
  if (!CONTRACT_ADDRESS) throw new Error('Missing CONTRACT_ADDRESS')

  const rarity = Math.max(1, Math.min(100, Number(form?.rarity ?? 1)))
  onStatus('signing')

  try {
    // Garantiza que la wallet esté lista (Sepolia), sin forzar switch
    // await getWalletClientSafe(wagmiConfig)

    const tx = await writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'safeMint',
      args: [form.name, form.description || '', rarity, form.tokenURI || ''],
      account: address,
      chainId: sepolia.id,
    })

    onStatus('submitted', { hash: tx.hash })

    const receipt = await waitForTransaction({
      hash: tx.hash,
      chainId: sepolia.id,
    })

    if (receipt.status === 'success' || receipt.status === 1) {
      onStatus('confirmed', { receipt })
      return receipt
    }
    throw new Error('Transaction failed')
  } catch (err) {
    if (err?.name === 'ChainMismatchError') {
      err.message = 'Tu wallet no está en Sepolia. Cambia a Sepolia en la wallet y vuelve a intentar.'
    }
    console.error('❌ Mint error:', err)
    onStatus('failed', { error: err })
    throw err
  }
}
