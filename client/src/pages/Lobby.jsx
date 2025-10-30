import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import socketContext from '../context/websocket/socketContext'
import globalContext from '../context/global/globalContext'
import gameContext from '../context/game/gameContext'
import { CS_FETCH_LOBBY_INFO } from '../pokergame/actions'
import HeaderLobby from '../components/header/HeaderLobby'
import TableCardLobby from '../components/cards/TableCardLobby'


export default function Lobby() {
  const navigate = useNavigate()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { socket } = useContext(socketContext)
  const { tables, players, setSelectedTableId, setTables, setPlayers } = useContext(globalContext)
  const { joinTable } = useContext(gameContext)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (!socket) return
    setLoading(true)
    socket.emit(CS_FETCH_LOBBY_INFO, {
      walletAddress: address,
      username: address ? `player_${address.slice(2, 6)}` : undefined,
    })
  }, [socket, address])

  useEffect(() => {
    if (Array.isArray(tables)) setLoading(false)
  }, [tables])

  const handleJoin = (tableId) => {
    console.log('[lobby] joining table', tableId)
    setSelectedTableId(tableId)
    navigate('/play', { replace: true })
  }


  const sortedTables = useMemo(() => {
    if (!Array.isArray(tables)) return []
    return [...tables].sort((a, b) => a.id - b.id)
  }, [tables])



  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(60% 60% at 50% 0%, #0a312c 0%, #071716 45%, #050b0a 100%)',
        color: '#e9fef9',
      }}
    >
      {/* Header */}
      <HeaderLobby />


      {/* Contenido principal */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
        <h2 style={{ margin: '8px 0 16px 0' }}>Available tables</h2>

        {loading && <div style={{ opacity: 0.7, fontSize: 14 }}>Loading lobby…</div>}

        {!loading && sortedTables.length === 0 && (
          <div style={{ opacity: 0.7, fontSize: 14 }}>No tables available.</div>
        )}

        <div style={{ display: 'grid', gap: 14 }}>
          {sortedTables.map((t) => (
            <TableCardLobby key={t.id} table={t} onJoin={handleJoin} />
          ))}
        </div>
      </main>
    </div>
  )
}
