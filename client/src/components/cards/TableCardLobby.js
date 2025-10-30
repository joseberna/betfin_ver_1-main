import React from "react";

function Stat({ label, value }) {
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <div style={{ opacity: 0.65, fontSize: 12 }}>{label}</div>
            <div style={{ fontWeight: 600 }}>{value}</div>
        </div>
    )
}
const TableCardLobby = ({ table, onJoin }) => {
    const sb = table.smallBlind ?? table.limit / 40
    const bb = table.bigBlind ?? (table.limit / 40) * 2

    return (
        <div
            style={{
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 16,
                padding: 16,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 12,
                background: 'rgba(255,255,255,.03)',
            }}
        >
            <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{table.name}</div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <Stat label="Players" value={`${table.currentNumberPlayers}/${table.maxPlayers}`} />
                    <Stat label="Blinds" value={`${sb} / ${bb}`} />
                    <Stat label="Buy-in" value={table.limit} />
                </div>
            </div>
            <div style={{ alignSelf: 'center' }}>
                <button
                    onClick={() => onJoin(table.id)}
                    style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: 'none',
                        background: '#20c997',
                        color: '#051b17',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: '0.2s all ease-in-out',
                    }}
                    onMouseOver={(e) => (e.target.style.background = '#1fb387')}
                    onMouseOut={(e) => (e.target.style.background = '#20c997')}
                >
                    Join
                </button>
            </div>
        </div>
    )
}

export default TableCardLobby;