export const mockAddress = '0x8B2733Ea0AaD06Cb02307B1aa0c88385dd037BB0'
export const wagmiConfig = {}

export const mockNFTs = [
  {
    tokenId: '1',
    name: 'BetPoker Genesis',
    description: 'First NFT',
    rarity: 10,
    tokenURI: 'ipfs://mock1',
  },
  {
    tokenId: '2',
    name: 'BetPoker Elite',
    description: 'Exclusive NFT',
    rarity: 99,
    tokenURI: 'ipfs://mock2',
  },
]

// Mock hooks de Wagmi
export const useAccount = vi.fn(() => ({
  address: mockAddress,
  isConnected: true,
  chain: { id: 11155111, name: 'Sepolia' },
}))

export const useUserNFTs = vi.fn(() => ({
  nfts: mockNFTs,
  total: mockNFTs.length,
  isLoading: false,
  error: null,
  refetchAll: vi.fn(),
}))

export const useWriteContract = vi.fn(() => ({
  writeContractAsync: vi.fn(async () => '0x79571fdE7Dbf6de45D1229576Cb4473Caa761144'),
  isPending: false,
}))

export const useWaitForTransactionReceipt = vi.fn(() => ({
  isLoading: false,
  isSuccess: true,
}))
