import React, { useContext, useRef, useMemo } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from 'react-router-dom'
import Button from '../buttons/Button'
import { PositionedUISlot } from '../game/PositionedUISlot'
import gameContext from '../../context/game/gameContext'
import globalContext from '../../context/global/globalContext'

const HeaderPlay = ({ }) => {
    const { isConnected, address } = useAccount()
    const { currentTable, leaveTable } = useContext(gameContext)
    const { selectedTableId, setSelectedTableId } = useContext(globalContext)
    const joinedRef = useRef(false)
    const navigate = useNavigate()

    const shortAddr = useMemo(
        () => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''),
        [address]
    )


    const handleLeave = () => {
        joinedRef.current = false
        leaveTable()
        setSelectedTableId(null)
        navigate('/lobby', { replace: true })
    }
    console.log('Rendering HeaderPlay, currentTable:', currentTable)

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,.06)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>Bet Poker</div>
                <div style={{ opacity: 0.6, fontSize: 12 }}>
                    {isConnected ? `Wallet: ${shortAddr}` : 'Not connected'}
                </div>
                {currentTable && (
                    <PositionedUISlot top="2vh" left="1.5rem" scale="0.65" style={{ zIndex: 50 }}>
                        <Button small secondary onClick={handleLeave}>Leave</Button>
                    </PositionedUISlot>
                )}
            </div>
        </header>
    )
}

export default HeaderPlay;