import React, { useContext, useEffect, useRef,useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import Button from '../components/buttons/Button'
import globalContext from '../context/global/globalContext'
import gameContext from '../context/game/gameContext'
import socketContext from '../context/websocket/socketContext'
import PokerTable from '../components/game/PokerTable'
import { RotateDevicePrompt } from '../components/game/RotateDevicePrompt'
import { PositionedUISlot } from '../components/game/PositionedUISlot'
import { PokerTableWrapper } from '../components/game/PokerTableWrapper'
import { Seat } from '../components/game/Seat/Seat'
import { InfoPill } from '../components/game/InfoPill'
import { GameUI } from '../components/game/GameUI'
import { GameStateInfo } from '../components/game/GameStateInfo'
import BrandingImage from '../components/game/BrandingImage'
import PokerCard from '../components/game/PokerCard'
import background from '../assets/img/background.png'
import { useAccount } from 'wagmi'
import { CS_FETCH_LOBBY_INFO, SC_RECEIVE_LOBBY_INFO } from '../pokergame/actions'
import './Play.scss'

const Play = () => {
  const [winnerMessage, setWinnerMessage] = useState(null)
  const navigate = useNavigate()
  const { socket } = useContext(socketContext)
  const { selectedTableId, setSelectedTableId } = useContext(globalContext)

  const {
    messages,
    currentTable,
    seatId,
    joinTable,
    leaveTable,
    sitDown,
    standUp,
    fold,
    check,
    call,
    raise,
  } = useContext(gameContext)

  const { isConnected, address } = useAccount()
  const [bet, setBet] = useState(0)
  const joinedRef = useRef(false)

  const shortAddr = useMemo(
      () => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''),
      [address]
    )

  useEffect(() => {
    if (!socket || !isConnected) return
    socket.emit(CS_FETCH_LOBBY_INFO, {
      walletAddress: address,
      username: address ? `player_${address.slice(2, 6)}` : undefined,
    })
  }, [socket, isConnected, address])

  
  useEffect(() => {
    if (!isConnected) navigate('/', { replace: true })
  }, [isConnected, navigate])

  
  useEffect(() => {
    if (selectedTableId == null) navigate('/lobby', { replace: true })
  }, [selectedTableId, navigate])

  
  useEffect(() => {
    if (!socket || joinedRef.current || selectedTableId == null) return

    const doJoin = () => {
      if (joinedRef.current) return
      joinTable(selectedTableId)
      joinedRef.current = true
    }

    const onceLobby = () => { doJoin() }
    socket.once(SC_RECEIVE_LOBBY_INFO, onceLobby)

    if (socket.connected) {
      setTimeout(() => !joinedRef.current && doJoin(), 300)
    } else {
      socket.once('connect', () => {
        socket.emit(CS_FETCH_LOBBY_INFO, {
          walletAddress: address,
          username: address ? `player_${address.slice(2, 6)}` : undefined,
        })
      })
    }

    return () => {
      socket.off(SC_RECEIVE_LOBBY_INFO, onceLobby)
      socket.off('connect')
    }
  }, [socket, joinTable, selectedTableId, address])

  
  useEffect(() => {
    if (!currentTable) return
    const { callAmount, minBet, pot, minRaise } = currentTable
    if (callAmount > minBet) setBet(callAmount)
    else if (pot > 0) setBet(minRaise)
    else setBet(minBet)
  }, [currentTable])

  
  useEffect(() => {
    if (currentTable?.winMessages?.length > 0) {
      const lastWin = currentTable.winMessages.at(-1)
      setWinnerMessage(lastWin)
      const t = setTimeout(() => setWinnerMessage(null), 4000)
      return () => clearTimeout(t)
    }
  }, [currentTable?.winMessages])

  
  const handleLeave = () => {
    joinedRef.current = false
    leaveTable()
    setSelectedTableId(null)
    navigate('/lobby', { replace: true })
  }

  return (
    <>
      <RotateDevicePrompt />
      <Container
        fullHeight
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          backgroundColor: 'black',
        }}
        className="play-area"
      >

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

        <PokerTableWrapper>
          <PokerTable />

          {currentTable && (
            <>
              {[1, 2, 3, 4, 5].map((n, i) => {
                const pos = [
                  { top: '-5%', left: '0', origin: 'top left' },
                  { top: '-5%', right: '2%', origin: 'top right' },
                  { bottom: '15%', right: '2%', origin: 'bottom right' },
                  { bottom: '8%', origin: 'bottom center' },
                  { bottom: '15%', left: '0', origin: 'bottom left' },
                ][i]
                return (
                  <PositionedUISlot key={n} scale="0.55" {...pos}>
                    <Seat seatNumber={n} currentTable={currentTable} sitDown={sitDown} />
                  </PositionedUISlot>
                )
              })}

              <PositionedUISlot top="-25%" scale="0.55" origin="top center" style={{ zIndex: 1 }}>
                <BrandingImage />
              </PositionedUISlot>

              <PositionedUISlot
                width="100%"
                origin="center center"
                scale="0.6"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {currentTable.board?.map((card, i) => <PokerCard key={i} card={card} />)}
              </PositionedUISlot>

              <PositionedUISlot top="-5%" scale="0.6" origin="bottom center" style={{ minHeight: 60 }}>
                {winnerMessage
                  ? <InfoPill>{winnerMessage}</InfoPill>
                  : (messages?.length ? <InfoPill>{messages.at(-1)}</InfoPill> : null)}
              </PositionedUISlot>

              <PositionedUISlot top="12%" scale="0.6" origin="center center">
                {(currentTable.winMessages?.length ?? 0) === 0 && (
                  <GameStateInfo currentTable={currentTable} />
                )}
              </PositionedUISlot>
            </>
          )}
        </PokerTableWrapper>

        {currentTable?.seats?.[seatId]?.turn && (
          <div className="controls-dock">
            <GameUI
              currentTable={currentTable}
              seatId={seatId}
              bet={bet}
              setBet={setBet}
              raise={raise}
              standUp={standUp}
              fold={fold}
              check={check}
              call={call}
            />
          </div>
        )}
      </Container>
    </>
  )
}

const btn = (type) => ({
  padding: '8px 12px',
  borderRadius: 8,
  border: 'none',
  background: type === 'primary' ? '#20c997' : '#444',
  color: type === 'primary' ? '#051b17' : '#fff',
  fontWeight: 700,
  cursor: 'pointer',
})

export default Play
