import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from '../pages/Profile'
import '@testing-library/jest-dom'

// 🧪 Variable de prueba para la wallet
const WALLET_ADDRESS_TEST = '0x8B2733Ea0AaD06Cb02307B1aa0c88385dd037BB0'

// ✅ Mock de wagmiConfig (no usado directamente pero referenciado)
jest.mock('../web3/wagmiConfig', () => ({
  wagmiConfig: {},
}))

// ✅ Mock de la función que limpia el estado de la wallet
jest.mock('../web3/purgeWalletState', () => ({}))

// ✅ Mocks de wagmi
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: WALLET_ADDRESS_TEST,
    isConnected: true,
  }),
  useWriteContract: () => ({
    writeContract: jest.fn(),
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: false,
  }),
  useDisconnect: () => ({
    disconnect: jest.fn(),
  }),
}))

// ✅ Mock de la chain sepolia si se usa internamente
jest.mock('wagmi/chains', () => ({
  sepolia: {
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
  },
}))

// ✅ Mock del hook useUserNFTs
const mockUseUserNFTs = jest.fn()
jest.mock('../hooks/useUserNFTs', () => ({
  __esModule: true,
  useUserNFTs: () => mockUseUserNFTs(),
}))

// 🧪 Test suite
describe('🧪 <Profile />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('debe renderizar la vista de perfil correctamente', () => {
    mockUseUserNFTs.mockReturnValue({
      loading: false,
      nfts: [],
    })

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )

    expect(screen.getByText(/Mint new NFT/i)).toBeInTheDocument()
    expect(screen.getByText(/My NFTs/i)).toBeInTheDocument()
  })

  test('debe renderizar los NFTs del usuario si existen', async () => {
    mockUseUserNFTs.mockReturnValue({
      loading: false,
      nfts: [
        {
          id: 1,
          name: 'BetFin NFT 001',
          image: 'https://via.placeholder.com/150',
        },
      ],
    })

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/BetFin NFT 001/i)).toBeInTheDocument()
    })
  })

  test('debe mostrar mensaje si el usuario no tiene NFTs', async () => {
    mockUseUserNFTs.mockReturnValue({
      loading: false,
      nfts: [],
    })

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No NFTs yet/i)).toBeInTheDocument()
    })
  })
})
