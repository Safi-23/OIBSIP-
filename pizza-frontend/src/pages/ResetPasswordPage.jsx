import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      display: 'flex', minHeight: '100vh', background: '#1C1917',
      fontFamily: "'Inter', sans-serif"
    },
    left: {
      flex: 1, background: '#1C1917', display: 'flex',
      flexDirection: 'column', justifyContent: 'center',
      padding: '3rem 3.5rem', position: 'relative', overflow: 'hidden'
    },
    glow: {
      position: 'absolute', top: '-120px', left: '-120px',
      width: '380px', height: '380px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
      pointerEvents: 'none'
    },
    logo: {
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px',
      letterSpacing: '2px', color: '#E7E5E4', marginBottom: '3rem'
    },
    logoSpan: { color: '#F97316' },
    heroLabel: {
      fontSize: '11px', fontWeight: '600', letterSpacing: '3px',
      textTransform: 'uppercase', color: '#F97316', marginBottom: '1rem'
    },
    heroTitle: {
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '72px',
      lineHeight: '0.95', color: '#E7E5E4', marginBottom: '1.5rem',
      letterSpacing: '1px'
    },
    heroTitleOrange: { color: '#F97316' },
    heroDesc: {
      fontSize: '14px', color: '#A8A29E', lineHeight: '1.7',
      maxWidth: '340px', marginBottom: '2.5rem'
    },
    features: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
    feature: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#78716C' },
    featureDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#F97316', flexShrink: 0 },
    right: {
      width: '420px', flexShrink: 0, background: '#111110',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '3rem 2.5rem', borderLeft: '1px solid #292524'
    },
    formTag: {
      fontSize: '11px', fontWeight: '600', letterSpacing: '3px',
      textTransform: 'uppercase', color: '#44403C', marginBottom: '4px'
    },
    formTitle: {
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px',
      letterSpacing: '1px', color: '#E7E5E4', marginBottom: '4px'
    },
    formSub: { fontSize: '13px', color: '#78716C', marginBottom: '2rem', lineHeight: '1.6' },
    successBanner: {
      background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
      color: '#F97316', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '8px',
      lineHeight: '1.5'
    },
    errorBanner: {
      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
      color: '#FCA5A5', fontSize: '13px', padding: '10px 14px',
      borderRadius: '8px', marginBottom: '1rem'
    },
    inputGroup: { marginBottom: '1rem' },
    inputLabel: {
      fontSize: '11px', fontWeight: '600', letterSpacing: '1px',
      textTransform: 'uppercase', color: '#78716C', marginBottom: '6px', display: 'block'
    },
    inputWrap: { position: 'relative' },
    input: {
      width: '100%', background: '#1C1917', border: '1px solid #292524',
      color: '#E7E5E4', padding: '12px 14px 12px 42px', borderRadius: '8px',
      fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif'
    },
    inputIcon: {
      position: 'absolute', left: '14px', top: '50%',
      transform: 'translateY(-50%)', color: '#44403C', fontSize: '16px'
    },
    btn: {
      width: '100%', background: loading ? '#44403C' : '#F97316',
      color: 'white', border: 'none', padding: '13px', borderRadius: '8px',
      fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px',
      cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
      fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '8px'
    },
    backRow: { textAlign: 'center', fontSize: '13px', color: '#78716C', marginTop: '1.5rem' },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.31.0/iconfont/tabler-icons.min.css"/>
      <div style={s.page}>

        {/* LEFT */}
        <div style={s.left}>
          <div style={s.glow}></div>
          <div style={s.logo}>PIZZA<span style={s.logoSpan}>HOT</span></div>
          <div style={s.heroLabel}>Almost there</div>
          <h1 style={s.heroTitle}>
            SET A NEW<br/>
            <span style={s.heroTitleOrange}>PASSWORD</span>
          </h1>
          <p style={s.heroDesc}>Choose a strong new password to keep your pizza account safe and secure.</p>
          <div style={s.features}>
            <div style={s.feature}><div style={s.featureDot}></div>Encrypted &amp; secure</div>
            <div style={s.feature}><div style={s.featureDot}></div>One-time link</div>
          </div>
          <svg style={{ position:'absolute', bottom:'30px', right:'30px', width:'260px', height:'260px', opacity:0.08, pointerEvents:'none' }} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" stroke="#F97316" strokeWidth="2" fill="none"/>
            <circle cx="100" cy="100" r="75" stroke="#F97316" strokeWidth="1" strokeDasharray="6 4" fill="none"/>
            <circle cx="100" cy="100" r="20" fill="#F97316"/>
            <line x1="100" y1="5" x2="100" y2="195" stroke="#F97316" strokeWidth="0.5" opacity="0.4"/>
            <line x1="5" y1="100" x2="195" y2="100" stroke="#F97316" strokeWidth="0.5" opacity="0.4"/>
            <line x1="30" y1="30" x2="170" y2="170" stroke="#F97316" strokeWidth="0.5" opacity="0.4"/>
            <line x1="170" y1="30" x2="30" y2="170" stroke="#F97316" strokeWidth="0.5" opacity="0.4"/>
            <circle cx="58" cy="58" r="8" stroke="#F97316" strokeWidth="1.5" fill="none"/>
            <circle cx="142" cy="58" r="6" stroke="#F97316" strokeWidth="1.5" fill="none"/>
            <circle cx="100" cy="142" r="7" stroke="#F97316" strokeWidth="1.5" fill="none"/>
            <circle cx="142" cy="142" r="9" stroke="#F97316" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        {/* RIGHT */}
        <div style={s.right}>
          <div style={s.formTag}>Account</div>
          <div style={s.formTitle}>New Password</div>
          <div style={s.formSub}>Enter and confirm your new password below.</div>

          {message && (
            <div style={s.successBanner}>
              <i className="ti ti-circle-check" style={{ marginTop:'2px' }}></i>
              <span>{message} Redirecting to sign in...</span>
            </div>
          )}

          {error && <div style={s.errorBanner}>{error}</div>}

          {!message && (
            <form onSubmit={handleSubmit}>
              <div style={s.inputGroup}>
                <label style={s.inputLabel}>New Password</label>
                <div style={s.inputWrap}>
                  <i className="ti ti-lock" style={s.inputIcon}></i>
                  <input style={s.input} type="password" placeholder="Enter new password"
                    value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
              </div>

              <div style={s.inputGroup}>
                <label style={s.inputLabel}>Confirm Password</label>
                <div style={s.inputWrap}>
                  <i className="ti ti-lock-check" style={s.inputIcon}></i>
                  <input style={s.input} type="password" placeholder="Confirm new password"
                    value={confirm} onChange={e => setConfirm(e.target.value)} required/>
                </div>
              </div>

              <button type="submit" style={s.btn} disabled={loading}>
                <i className="ti ti-pizza"></i>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div style={s.backRow}>
            <Link to="/" style={{ color:'#F97316', textDecoration:'none', fontWeight:'600' }}>
              ← Back to Sign In
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}

export default ResetPasswordPage;
