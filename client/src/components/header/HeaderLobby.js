import React, { useContext, useState } from "react"
import { useAccount } from "wagmi"
import globalContext from '../../context/global/globalContext'
import ButtonDisconnectHeader from "../buttons/ButtonDisconnectHeader"
import ButtonNavigationHeader from "../buttons/ButtonNavigateHeader"

const HeaderProfile = ({ }) => {
    const { address, isConnected } = useAccount()
    const { players } = useContext(globalContext)
    const [copied, setCopied] = useState(false)


    function Stat({ label, value }) {
        return (
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <div style={{ opacity: 0.65, fontSize: 12 }}>{label}</div>
                <div style={{ fontWeight: 600 }}>{value}</div>
            </div>
        )
    }

    const handlerCopy = async () => {
        if (!address) return
        try {
            await navigator.clipboard.writeText(address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (_) { }

    }

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,.06)',
            }}>
            {copied && (
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(32,201,151,0.95)',
                        color: '#03221b',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontWeight: 700,
                        boxShadow: '0 4px 20px rgba(0,0,0,.25)',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }}
                >
                    Copiado al portapapeles
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <h2 style={{ fontWeight: 800, letterSpacing: 1, margin: 0 }}>Bet Poker</h2>
                <div style={{ opacity: 0.6, cursor: 'pointer', fontWeight: 150 }}
                    onClick={handlerCopy}>
                    {isConnected ? `${address?.slice(0, 6)}…${address?.slice(-4)}` : 'Not connected'}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Stat label="Players online" value={Array.isArray(players) ? players.length : 0} />
                <ButtonNavigationHeader goTo="/profile" label="Profile" />
                <ButtonDisconnectHeader />
            </div>
        </header>
    )
}

export default HeaderProfile;