import React, { useState } from 'react';
import { api } from '../services/api';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('OLENA KOVALENKO');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!booking) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.payments.create(booking.id, booking.totalPrice);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Помилка при проведенні платежу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Оплата туру онлайн</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>
              Замовлення #{booking.id} — {booking.tour?.title}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Оплату успішно здійснено!
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Сума <strong>${booking.totalPrice}</strong> списана з картки. Статус бронювання оновлено до «ОПЛАЧЕНО».
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay}>
              {/* Virtual Card Preview */}
              <div className="credit-card-preview">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.8 }}>TRAVEL AGENCY CARD</span>
                  <ShieldCheck size={20} color="#a7f3d0" />
                </div>
                <div className="card-chip" />
                <div className="card-number-display">{cardNumber}</div>
                <div className="card-details-row">
                  <div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>ВЛАСНИК КАРТКИ</div>
                    <div style={{ fontWeight: 600 }}>{cardHolder}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>ДІЙСНА ДО</div>
                    <div style={{ fontWeight: 600 }}>{expiry}</div>
                  </div>
                </div>
              </div>

              {/* Amount Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.85rem 1rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Разом до оплати:</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ${booking.totalPrice}
                </span>
              </div>

              {/* Card Inputs */}
              <div className="form-group">
                <label className="form-label">Номер банківської картки</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                  <CreditCard size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Термін дії (ММ/РР)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV код</label>
                  <input
                    type="password"
                    maxLength="3"
                    className="form-input"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ім'я та прізвище власника (латиницею)</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  required
                />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '0.75rem', border: '1px solid var(--color-danger-border)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
                <Lock size={12} />
                Платіж захищено 256-бітним SSL-шифруванням.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={loading}
              >
                {loading ? 'Обробка платежу...' : `Сплатити $${booking.totalPrice}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
