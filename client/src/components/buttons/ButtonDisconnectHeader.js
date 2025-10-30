import React from 'react';
import { useDisconnect } from 'wagmi'
import { useNavigate } from 'react-router-dom'



const ButtonDisconnectHeader = ({ label }) => {
    const { disconnect } = useDisconnect()
    const navigate = useNavigate()

    function handleLogout() {
        try {
            localStorage.removeItem('token')
            window?.socket?.emit?.('CS_DISCONNECT')
            window?.socket?.close?.()
        } finally {
            disconnect()
            navigate('/', { replace: true })
        }
    }
    return (
        <button
            onClick={handleLogout}
            style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#ff4d4f', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
            Disconnect
        </button>
    )
}



export default ButtonDisconnectHeader;