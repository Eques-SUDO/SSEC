import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authApi } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import { Icon } from '../components/icons.jsx';

const ERROR_MAP = {
  invalid_credentials: 'Identifiants incorrects.',
  invalid_input:       'Veuillez renseigner un email valide et un mot de passe.',
  account_disabled:    'Ce compte est désactivé. Contactez l\'administrateur.',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authApi.login(email, password);
      login(token, user);
      toast.success('Connexion réussie', `Bienvenue ${user.prenom} !`);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = ERROR_MAP[err.message] ?? 'Erreur de connexion. Veuillez réessayer.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit} noValidate>
        <div className="login-brand">
          <div className="login-brand-mark">SS</div>
          SSEC
        </div>

        <div>
          <h1>Se connecter</h1>
          <div className="login-sub">Système de suivi d'entreprise commerciale</div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={'input' + (error ? ' is-invalid' : '')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            className={'input' + (error ? ' is-invalid' : '')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <div className="login-alert" role="alert">
            <Icon.Alert width={16} height={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn--primary btn--block"
          disabled={loading}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <div className="login-footnote">
          Comptes de démo&nbsp;: <code>direction@ssec.local</code> · <code>employe@ssec.local</code> · <code>admin@ssec.local</code>
          <br />
          Mot de passe&nbsp;: <code>password</code>
        </div>
      </form>
    </div>
  );
}
