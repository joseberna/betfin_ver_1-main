import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useDisconnect, useWalletClient } from 'wagmi'
import { loadUserNFTs, mintNFT, getTxUrl, CONTRACT_ADDRESS } from '../services/nftService'
import DisconnectButton from '../components/buttons/DisconnectButton'

export default function Profile() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const navigate = useNavigate()

  const [nfts, setNfts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', rarity: 10, tokenURI: '' })
  const [loading, setLoading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [status, setStatus] = useState('idle')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isConnected || !address) return
    ;(async () => {
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

  const handleDisconnect = () => {
    disconnect()
    setNfts([])
    navigate('/', { replace: true })
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
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ fontWeight: 800, letterSpacing: 1, margin: 0 }}>Bet Poker</h2>
          <div style={{ opacity: 0.6, fontSize: 12 }}>
            {isConnected ? `Wallet: ${address?.slice(0, 6)}…${address?.slice(-4)}` : 'Not connected'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/lobby')}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #20c997',
              background: 'transparent',
              color: '#20c997',
              fontWeight: 700,
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseOver={(e) => (e.target.style.background = '#20c99720')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
          >
            ← Back to Lobby
          </button>
          {isConnected && <DisconnectButton />}
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
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

        {/* Columna derecha: NFTs */}
        <div
          style={{
            flex: '1 1 400px',
            maxHeight: 520,
            overflowY: 'auto',
            borderRadius: 12,
            padding: 16,
            border: '1px solid rgba(32,201,151,0.3)',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: 'inset 0 0 10px #00ffcc20',
          }}
        >
          <h2 style={{ color: '#20c997', textShadow: '0 0 10px #20c99780' }}>My NFTs</h2>
          {loading ? (
            <p>Cargando…</p>
          ) : nfts.length === 0 ? (
            <p style={{ color: '#999' }}>No NFTs yet.</p>
          ) : (
            nfts.map((n) => (
              <div
                key={n.tokenId}
                style={{
                  background: '#0f1917',
                  border: '1px solid #20c99740',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  boxShadow: '0 0 10px #20c99720',
                  transition: '0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 0 15px #20c99760')}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 0 10px #20c99720')}
              >
                <strong style={{ color: '#20c997' }}>#{n.tokenId}</strong> —{' '}
                <span>{n.name}</span> · rarity {n.rarity}
                <div style={{ fontSize: 13, opacity: 0.7 }}>{n.description}</div>
                {n.tokenURI && (
                  <a
                    href={n.tokenURI}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#39f', fontSize: 12 }}
                  >
                    View Metadata
                  </a>
                )}
              </div>
            ))
          )}
        </div>
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
