

export const wagmiConfig = {}

export const sepolia = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.org'],
    },
  },
}

export const mockWagmi = {
  useAccount: () => ({
    address: '0x8B2733Ea0AaD06Cb02307B1aa0c88385dd037BB0',
    isConnected: true,
  }),
  useWriteContract: () => ({
    writeContract: jest.fn(),
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: false,
  }),
}
