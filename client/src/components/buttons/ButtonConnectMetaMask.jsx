import React from 'react'
import { useConnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

export default function ButtonConnectMetaMask() {
  const { connect, isLoading, error } = useConnect({
    connector: new MetaMaskConnector({ options: { shimDisconnect: true } }),
  })

  return (
    <div>
      <button disabled={isLoading} onClick={() => connect()}>
        {isLoading ? 'Connecting…' : 'Connect MetaMask'}
      </button>
      {error && <div style={{color:'tomato', fontSize:12}}>{error.message}</div>}
    </div>
  )
}
