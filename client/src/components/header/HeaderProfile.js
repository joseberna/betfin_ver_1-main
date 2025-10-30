import React from 'react';
import { useNavigate } from 'react-router-dom'
import ButtonDisconnectHeader from '../buttons/ButtonDisconnectHeader';
import ButtonNavigationHeader from '../buttons/ButtonNavigateHeader';
import { useAccount } from 'wagmi'

const HeaderProfile = ({  }) => {
const { address, isConnected } = useAccount()

    return (
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
            {isConnected ? `${address?.slice(0, 6)}…${address?.slice(-4)}` : 'Not connected'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ButtonNavigationHeader goTo="/lobby" label="Lobby" />
          <ButtonDisconnectHeader  />
        </div>
      </header>
    )
}

export default HeaderProfile;