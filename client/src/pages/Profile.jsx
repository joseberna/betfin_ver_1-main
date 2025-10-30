import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { loadUserNFTs, mintNFT, getTxUrl } from '../services/nftService'
import HeaderProfile from '../components/header/HeaderProfile'
import TableNFT from '../components/tables/TableNFT'
import { sepolia } from 'wagmi/chains'

export default function Profile() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient({ chainId: sepolia.id })
  const [nfts, setNfts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', rarity: 10, tokenURI: '' })
  const [loading, setLoading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [status, setStatus] = useState('idle')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isConnected || !walletClient) {
      setError('Conecta tu wallet (Sepolia) primero.');
      return
    }

  }, [walletClient])

  useEffect(() => {

    if (!isConnected || !address) return
      ; (async () => {
        try {
          setError('')
          setLoading(true)
          const data = await loadUserNFTs(address)
          setNfts(data)
        } catch (err) {
          console.error(err)
          setError(err.message || 'Error loading NFTs')
        } finally {
          setLoading(false)
        }
      })()
  }, [address, isConnected])

  const handleMint = async (e) => {
    e.preventDefault()
    if (!walletClient) {
      setError('Conecta tu wallet primero')
      return
    }

    setMinting(true)
    setError('')
    setTxHash('')
    setStatus('idle')

    try {
      await mintNFT(address, form, (s, payload) => {
        setStatus(s)
        if (s === 'submitted' && payload?.hash) setTxHash(payload.hash)
      })

      const list = await loadUserNFTs(address)
      setNfts(list)
      setForm({ name: '', description: '', rarity: 10, tokenURI: '' })
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Mint failed')
      setStatus('failed')
    } finally {
      setMinting(false)
    }
  }


  const renderTxBanner = () => {
    if (status === 'signing') return <p>✍️ Firma la transacción en tu wallet…</p>
    if (status === 'submitted')
      return (
        <p>
          ⏳ Transacción enviada…{' '}
          {txHash && (
            <a href={getTxUrl(txHash)} target="_blank" rel="noreferrer">
              Ver en Etherscan
            </a>
          )}
        </p>
      )
    if (status === 'confirmed')
      return (
        <p style={{ color: 'lime' }}>
          ✅ ¡Transacción confirmada!{' '}
          {txHash && (
            <a href={getTxUrl(txHash)} target="_blank" rel="noreferrer">
              Etherscan
            </a>
          )}
        </p>
      )
    if (status === 'failed') return <p style={{ color: 'tomato' }}>❌ La transacción falló.</p>
    return null
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #0b2a24 0%, #050b0a 100%)',
        color: '#e9fef9',
        fontFamily: 'Orbitron, sans-serif',
        paddingBottom: 40,
      }}
    >
      <HeaderProfile />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          padding: '40px 5%',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {/* Columna izquierda: formulario */}
        <div
          style={{
            flex: '1 1 360px',
            maxWidth: 480,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 0 20px #00ffcc20',
            border: '1px solid rgba(32,201,151,0.3)',
          }}
        >
          <h2 style={{ color: '#20c997', textShadow: '0 0 10px #20c99780' }}>Mint new NFT</h2>

          <form onSubmit={handleMint} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, minHeight: 80 }}
            />
            <input
              type="number"
              min={1}
              max={100}
              placeholder="Rarity (1-100)"
              value={form.rarity}
              onChange={(e) => setForm({ ...form, rarity: Number(e.target.value) })}
              style={inputStyle}
            />
            <input
              placeholder="Token URI (optional)"
              value={form.tokenURI}
              onChange={(e) => setForm({ ...form, tokenURI: e.target.value })}
              style={inputStyle}
            />

            <button
              className="btn"
              type="submit"
              disabled={minting || !form.name}
              style={{
                padding: '10px 0',
                borderRadius: 8,
                background: minting ? '#155a47' : '#20c997',
                color: '#051b17',
                fontWeight: 800,
                cursor: minting ? 'wait' : 'pointer',
                border: 'none',
                transition: '0.2s',
              }}
            >
              {minting ? 'Minting…' : 'Mint'}
            </button>
          </form>

          <div style={{ marginTop: 10 }}>
            {renderTxBanner()}
            {error && <p style={{ color: 'tomato' }}>{error}</p>}
          </div>
        </div>


        <TableNFT nfts={nfts} loading={loading} />

      </div>
    </div>
  )
}

const inputStyle = {
  padding: '10px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f1917',
  color: '#e9fef9',
  fontFamily: 'inherit',
  outline: 'none',
}
