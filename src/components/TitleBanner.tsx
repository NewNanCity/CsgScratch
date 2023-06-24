import React from 'react';
import { version } from '@/data/version';

export default React.memo(() => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 100,
    }}
  >
    <div
      style={{
        padding: '10px',
        backgroundImage: 'linear-gradient(45deg, #00457e7d, #62002882)',
        color: '#fffa',
        fontSize: '14px',
        borderRadius: '10px',
      }}
    >
      Version: {version} | Sttot for NewNanCity
    </div>
  </div>
));
