import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Lock,
  Briefcase,
  Shield,
  LogIn,
  UserPlus,
  AlertCircle
} from 'lucide-react';

export const AuthModal = ({ onClose }) => {
  const { login, register, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(role);
      onClose();
    } catch (err) {
      setError(err.message || 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <h2>{isRegister ? 'Реєстрація клієнта' : 'Вхід у систему'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick 1-click role logins */}
          <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
              Швидкий вхід для тестування ролей:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', background: '#ffffff' }}
                onClick={() => handleQuickLogin('CLIENT')}
              >
                <User size={15} color="#2563eb" />
                <span>Клієнт (Олена - постійний клієнт, 10% знижка)</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', background: '#ffffff' }}
                onClick={() => handleQuickLogin('MANAGER')}
              >
                <Briefcase size={15} color="#d97706" />
                <span>Турагент / Менеджер (керування турами та знижками)</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', background: '#ffffff' }}
                onClick={() => handleQuickLogin('ADMIN')}
              >
                <Shield size={15} color="#7e22ce" />
                <span>Адміністратор системи</span>
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#ffffff', padding: '0 0.75rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
              або введіть логін
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Ім'я користувача (Username)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="наприклад: olena або manager"
                  required
                />
                <User size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ваш пароль"
                  required
                />
                <Lock size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '0.75rem', border: '1px solid var(--color-danger-border)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Завантаження...' : isRegister ? 'Зареєструватися' : 'Увійти'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
            >
              {isRegister ? 'Вже маєте акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
