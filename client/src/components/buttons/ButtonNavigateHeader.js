import React from 'react';
import { useNavigate } from 'react-router-dom'

const ButtonNavigationHeader = ({ goTo, label }) => {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => navigate(goTo)}
            style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #20c997',
                background: 'transparent',
                color: '#20c997',
                fontWeight: 700,
                cursor: 'pointer',
                transition: '0.2s',
            }}
            onMouseOver={(e) => (e.target.style.background = '#20c99720')}
            onMouseOut={(e) => (e.target.style.background = 'transparent')}
        >
            {label}
        </button>
    )
}

export default ButtonNavigationHeader;