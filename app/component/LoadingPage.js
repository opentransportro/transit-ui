import React from 'react';
import Loading from './Loading';

export default function LoadingPage() {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Loading width={150} height={150} />
    </div>
  );
}
