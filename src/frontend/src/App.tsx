import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f3f4f6',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        color: '#1f2937', 
        fontSize: '2.5rem', 
        marginBottom: '1rem' 
      }}>
        🛡️ Securet Flow SSC
      </h1>
      <p style={{ 
        color: '#6b7280', 
        fontSize: '1.2rem', 
        marginBottom: '2rem' 
      }}>
        Sistema de Segurança Cibernética
      </p>
      <div style={{ 
        backgroundColor: '#10b981', 
        color: 'white', 
        padding: '1rem', 
        borderRadius: '0.5rem',
        display: 'inline-block'
      }}>
        ✅ Frontend funcionando corretamente!
      </div>
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#dbeafe', 
        borderRadius: '0.5rem',
        border: '1px solid #3b82f6'
      }}>
        <p style={{ color: '#1e40af', margin: 0 }}>
          <strong>Status:</strong> Sistema operacional<br/>
          <strong>Versão:</strong> 1.0.0<br/>
          <strong>Backend:</strong> Conectado
        </p>
      </div>
    </div>
  );
};

export default App; 