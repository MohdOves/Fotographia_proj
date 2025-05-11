import React from 'react';
import { useNavigate } from 'react-router-dom';
import FaceMatch from '../components/FaceMatch';

const FaceMatchPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '40px auto', 
      padding: '0 20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '28px',
          color: '#2d3748',
          margin: 0
        }}>Face Match</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '2px solid #6c63ff',
            background: 'white',
            color: '#6c63ff',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s',
            fontSize: '16px'
          }}
          onMouseOver={e => {
            e.target.style.background = '#6c63ff';
            e.target.style.color = 'white';
          }}
          onMouseOut={e => {
            e.target.style.background = 'white';
            e.target.style.color = '#6c63ff';
          }}
        >
          Back to Dashboard
        </button>
      </div>
      <FaceMatch />
    </div>
  );
};

export default FaceMatchPage; 