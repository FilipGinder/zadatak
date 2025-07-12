import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setJwtLoginToken } from '../redux/pages/Login';

const Login: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(''); 

    try {
      const response = await fetch('http://localhost/zadatak/Login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Neispravno korisničko ime ili lozinka');
      }

      dispatch(setJwtLoginToken(data.token));
      navigate('/products');
    } catch (error: any) {
      setErrorMessage(error.message || 'Došlo je do greške prilikom logovanja.');
      console.error('Greška prilikom login zahteva:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage !== '') {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 2500);

      setErrorTimeoutId(timeoutId);
    }

    
    return () => {
      if (errorTimeoutId) clearTimeout(errorTimeoutId);
    };
  }, [errorMessage]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Sign in</h2>

          {errorMessage && (
            <p style={styles.error}>{errorMessage}</p>
          )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            placeholder="Enter a username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            placeholder="Enter a password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2'
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '.5rem',
    color: '#555',
    fontWeight: 500
  },
  input: {
    width: '100%',
    padding: '.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    padding: '.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
};

export default Login;
