import React from "react";

const TableNFT = ({ nfts, loading }) => {


    return (
        <div
            style={{
                flex: '1 1 400px',
                maxHeight: 520,
                overflowY: 'auto',
                borderRadius: 12,
                padding: 16,
                border: '1px solid rgba(32,201,151,0.3)',
                background: 'rgba(255,255,255,0.05)',
                boxShadow: 'inset 0 0 10px #00ffcc20',
            }}
        >
            <h2 style={{ color: '#20c997', textShadow: '0 0 10px #20c99780' }}>My NFTs</h2>
            {loading ? (
                <p>Cargando…</p>
            ) : nfts.length === 0 ? (
                <p style={{ color: '#999' }}>No NFTs yet.</p>
            ) : (
                nfts.map((n) => (
                    <div
                        key={n.tokenId}
                        style={{
                            background: '#0f1917',
                            border: '1px solid #20c99740',
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 10,
                            boxShadow: '0 0 10px #20c99720',
                            transition: '0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 0 15px #20c99760')}
                        onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 0 10px #20c99720')}
                    >
                        <strong style={{ color: '#20c997' }}>#{n.tokenId}</strong> —{' '}
                        <span>{n.name}</span> · rarity {n.rarity}
                        <div style={{ fontSize: 13, opacity: 0.7 }}>{n.description}</div>
                        {n.tokenURI && (
                            <a
                                href={n.tokenURI}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#39f', fontSize: 12 }}
                            >
                                View Metadata
                            </a>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}

export default TableNFT;