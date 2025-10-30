// client/src/pages/Profile.jsx
import React, { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import HeaderProfile from '../components/header/HeaderProfile'
import TableNFT from '../components/tables/TableNFT'
import { useUserNFTs } from '../hooks/useUserNFTs' 
import BetfinCollectible from '../abi/BetfinCollectible.json'

const CONTRACT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS
const ABI = Array.isArray(BetfinCollectible) ? BetfinCollectible : BetfinCollectible.abi

export default function Profile() {
  const { address, isConnected, chain } = useAccount()
  const { nfts, total, isLoading, error, refetchAll } = useUserNFTs(address) 
  const [form, setForm] = useState({ name: '', description: '', rarity: 10, tokenURI: '' })
  const [status, setStatus] = useState('idle')
  const [txHash, setTxHash] = useState('')
  const [localError, setLocalError] = useState('')
  const SEPOLIA_CHAIN_ID = 11155111

  // --- mint (wagmi v2 hooks) ---
  const { writeContractAsync, isPending: isSigning } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    chainId: SEPOLIA_CHAIN_ID,
  })

  const handleMint = async (e) => {
    e.preventDefault()
    setLocalError('')
    if (!isConnected) return setLocalError('Conecta tu wallet primero.')
    if (chain?.id !== SEPOLIA_CHAIN_ID) return setLocalError('Cambia a Sepolia en la wallet.')

    try {
      setStatus('signing')
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'safeMint',
        args: [form.name, form.description || '', Math.max(1, Math.min(100, Number(form.rarity || 1))), form.tokenURI || ''],
        account: address,
        chainId: SEPOLIA_CHAIN_ID,
      })
      setTxHash(hash)
      setStatus('submitted')
    } catch (err) {
      setStatus('failed')
      setLocalError(err?.message || 'Error firmando la transacción')
    }
  }

  // cuando confirma, refrescamos lista
  if (isSuccess && status !== 'confirmed') {
    setStatus('confirmed')
    setForm({ name: '', description: '', rarity: 10, tokenURI: '' })
    // refresca las lecturas del hook (expón esto en tu hook)
    refetchAll?.()
  }

  const renderTxBanner = () => {
    if (status === 'signing') return <p>✍️ Firma la transacción en tu wallet…</p>
    if (status === 'submitted')
      return (
        <p>
          ⏳ Transacción enviada…{' '}
          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
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
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
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
              disabled={!isConnected || isSigning || isConfirming || !form.name}
              style={{
                padding: '10px 0',
                borderRadius: 8,
                background: isSigning || isConfirming ? '#155a47' : '#20c997',
                color: '#051b17',
                fontWeight: 800,
                cursor: isSigning || isConfirming ? 'wait' : 'pointer',
                border: 'none',
                transition: '0.2s',
              }}
            >
              {isSigning ? 'Signing…' : isConfirming ? 'Confirming…' : 'Mint'}
            </button>
          </form>

          <div style={{ marginTop: 10 }}>
            {renderTxBanner()}
            {(localError || error) && (
              <p style={{ color: 'tomato' }}>{localError || String(error.message || error)}</p>
            )}
          </div>
        </div>

        {/* Columna derecha: listado */}
        <TableNFT nfts={nfts} loading={isLoading} total={total} />
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
