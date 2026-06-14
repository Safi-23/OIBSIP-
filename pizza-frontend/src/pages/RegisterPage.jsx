import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setMessage(data.message);
      setTimeout(() => navigate('/'), 2000); 
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
  <div style={{
    minHeight: '100vh',
    background: '#1C1917',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  }}>
    <div style={{
      width: '100%',
      maxWidth: '450px',
      background: '#292524',
      padding: '40px',
      borderRadius: '20px',
      border: '1px solid #44403C',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1
            style={{
              margin: 0,
              marginBottom: "40px",
              fontSize: "28px",
              color: "#FF8C00",
            }}
          >
            PIZZA<span style={{ color: "white" }}>HOT</span>
          </h1>

        <h2 style={{
          color: '#F5F5F4',
          marginBottom: '8px'
        }}>
          Create Account
        </h2>

        <p style={{
          color: '#A8A29E',
          fontSize: '14px'
        }}>
          Join and start building delicious pizzas
        </p>
      </div>

      {message && (
        <div style={{
          background: '#14532D',
          color: '#BBF7D0',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          background: '#7F1D1D',
          color: '#FECACA',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            background: '#1C1917',
            border: '1px solid #57534E',
            borderRadius: '10px',
            color: '#F5F5F4',
            fontSize: '15px',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            background: '#1C1917',
            border: '1px solid #57534E',
            borderRadius: '10px',
            color: '#F5F5F4',
            fontSize: '15px',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '20px',
            background: '#1C1917',
            border: '1px solid #57534E',
            borderRadius: '10px',
            color: '#F5F5F4',
            fontSize: '15px',
            boxSizing: 'border-box'
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: '#F97316',
            color: '#1C1917',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Create Account
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#A8A29E'
      }}>
        Already have an account?{' '}
        <Link
          to="/"
          style={{
            color: '#F97316',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Login
        </Link>
      </p>

    </div>
  </div>
);
}

export default RegisterPage;

