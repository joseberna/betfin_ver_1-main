import { useMemo } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import BetfinCollectible from '../abi/BetfinCollectible.json'

const CONTRACT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS
const ABI = Array.isArray(BetfinCollectible) ? BetfinCollectible : BetfinCollectible.abi

export function useUserNFTs(addressProp) {
  const { address: addrFromHook, isConnected } = useAccount()
  const address = addressProp ?? addrFromHook

  // 1) balanceOf
  const { data: balance, isLoading: isBalLoading, error: balError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(CONTRACT_ADDRESS && address && isConnected),
      refetchOnWindowFocus: false,
    },
  })

  const total = Number(balance || 0)

  // 2) tokenOfOwnerByIndex (batched)
  const tokenOfOwnerCalls = useMemo(() => {
    if (!CONTRACT_ADDRESS || !ABI || !Number.isFinite(total) || total <= 0) return []
    return Array.from({ length: total }, (_, i) => ({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, i],
    }))
  }, [address, total])

  const {
    data: tokenIdsRes,
    isLoading: isIdsLoading,
    error: idsError,
  } = useReadContracts({
    contracts: tokenOfOwnerCalls,
    query: {
      enabled: tokenOfOwnerCalls.length > 0,
      refetchOnWindowFocus: false,
    },
  })

  const tokenIds = useMemo(() => {
    if (!tokenIdsRes?.length) return []
    
    return tokenIdsRes
      .map((r, i) => (r?.result != null ? r.result : null))
      .filter((x) => x != null)
  }, [tokenIdsRes])

  // 3) getMetadata(tokenId) (batched)
  const metaCalls = useMemo(() => {
    if (!CONTRACT_ADDRESS || !ABI || tokenIds.length === 0) return []
    return tokenIds.map((tid) => ({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getMetadata',
      args: [tid],
    }))
  }, [tokenIds])

  const {
    data: metasRes,
    isLoading: isMetaLoading,
    error: metaError,
  } = useReadContracts({
    contracts: metaCalls,
    query: {
      enabled: metaCalls.length > 0,
      refetchOnWindowFocus: false,
    },
  })

  const nfts = useMemo(() => {
    if (!metasRes?.length) return []
    return metasRes.map((m, idx) => {
      const tokenId = tokenIds[idx]
      const meta = m?.result ?? {}
      return {
        tokenId: tokenId?.toString() ?? String(idx),
        name: meta?.name ?? 'Unnamed NFT',
        description: meta?.description ?? '',
        rarity: Number(meta?.rarity ?? 0),
        tokenURI: meta?.tokenURI ?? '',
      }
    })
  }, [metasRes, tokenIds])

  return {
    nfts,
    total,
    isLoading: isBalLoading || isIdsLoading || isMetaLoading,
    error: balError || idsError || metaError,
  }
}
