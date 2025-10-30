import React from 'react'
import { purgeWalletState } from '../../web3/purgeWalletState'
import { useNavigate } from 'react-router-dom'
import { useDisconnect } from 'wagmi'


export default function ButtonDisconnectHeader() {
  const navigate = useNavigate()
  const { disconnect } = useDisconnect()
  const handleDisconnect = async () => {
    try {
      await disconnect()
      await purgeWalletState()

      navigate('/connect')
      try {
        Object.keys(localStorage).forEach((k) => {
          if (/^wagmi\.|^wc@|walletconnect/i.test(k)) localStorage.removeItem(k)
        })
      } catch (_) { }
    } catch (e) {
      console.error(e)
    }
  }
  return <button
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
}
