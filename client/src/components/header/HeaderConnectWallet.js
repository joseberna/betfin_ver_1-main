import React, { useEffect, useState, useMemo } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useNavigate } from 'react-router-dom'

function getMetaMaskProvider() {
  const eth = typeof window !== 'undefined' ? window.ethereum : undefined
  if (!eth) return undefined

  
  if (eth.isMetaMask && typeof eth.request === 'function') return eth

  
  if (Array.isArray(eth.providers) && eth.providers.length) {
    const mm = eth.providers.find((p) => p?.isMetaMask && typeof p.request === 'function')
    if (mm) return mm
  }

  return undefined
}


export function HeaderConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [ready, setReady] = useState(false)
  const [isConnect, setIsConnect] = useState(false)
  const navigate = useNavigate()

  const connector = connectors[0];
  const metamaskConnector = useMemo(() => {
    if (!connectors?.length) return null
    return (
      connectors.find((c) => /metamask/i.test(c?.name)) ||
      connectors.find((c) => c?.id === 'injected') ||
      null
    )
  }, [connectors])

  useEffect(() => {
    if (isConnected) {
      setIsConnect(true)
      navigate('/lobby', { replace: true })
    }
  }, [isConnected, navigate])

  useEffect(() => {
    setReady(Boolean(metamaskConnector))
  }, [metamaskConnector])

  const handleConnect = async () => {
    const mmProvider = getMetaMaskProvider()
    if (!mmProvider) {
      alert('MetaMask no está instalada. Instálala desde https://metamask.io/')
      return
    }

    try {
      window.ethereum = mmProvider
      if (typeof globalThis !== 'undefined') globalThis.ethereum = mmProvider
    } catch (_) { }

    try {
      if (!metamaskConnector) throw new Error('Conector MetaMask no disponible')
      await connect({ connector: metamaskConnector })
      setIsConnect(true)
    } catch (err) {
      console.error('Error al conectar MetaMask:', err)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      try {
        Object.keys(localStorage).forEach((k) => {
          if (/^wagmi\.|^wc@|walletconnect/i.test(k)) localStorage.removeItem(k)
        })
      } catch (_) { }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <header
      style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 22px',
        background: 'rgba(0,0,0,.55)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        backdropFilter: 'blur(4px)',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <h2 style={{ fontWeight: 800, letterSpacing: 1, margin: 0 }}>Bet Poker</h2>
      </div>

      <div>
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid #ffffff22',
              background: '#151a1a',
              color: '#fff',
              cursor: 'pointer',

            }}
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={(handleConnect)}
            disabled={!ready || isPending}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: 'none',
              background: ready ? '#20c997' : '#27544d',
              color: '#031c17',
              fontWeight: 800,
              cursor: ready ? 'pointer' : 'not-allowed',
              boxShadow: '0 0 10px #20c99755',
            }}
          >
            {isPending ? 'Connecting…' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}
