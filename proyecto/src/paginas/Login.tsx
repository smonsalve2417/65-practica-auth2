import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../store/auth';

export function Login() {
  const login    = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const destino  = location.state?.from?.pathname ?? '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login({ email, password });
      navigate(destino, { replace: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <h1>Panel</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Contraseña
          <input type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p role="alert" className="error">{error}</p>}

        <button type="submit" disabled={enviando || !email || !password}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
