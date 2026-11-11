import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Ticket,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Users,
  Percent,
  Receipt
} from 'lucide-react';

export const MyBookings = ({ onPayBooking }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getMyBookings();
      setBookings(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="badge" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)' }}>
            <CheckCircle2 size={12} /> Оплачено
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
            <CheckCircle2 size={12} /> Підтверджено
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge" style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}>
            <XCircle size={12} /> Скасовано
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="badge" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: '1px solid var(--color-warning-border)' }}>
            <Clock size={12} /> Очікує оплати
          </span>
        );
    }
  };

  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-text">
          <h1>Мої замовлення та тури</h1>
          <p>
            Тут відображаються ваші заброньовані тури, статуси оплати та підтвердження менеджера.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Завантаження ваших бронювань...
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Ticket className="empty-state-icon" />
          <h3>У вас ще немає заброньованих турів</h3>
          <p>
            Перейдіть до каталогу турів, оберіть відпочинок, екскурсію чи шопінг-тур та оформіть бронювання.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => {
            const tour = booking.tour || {};
            const isAwaitingPayment = booking.status === 'NEW';

            return (
              <div
                key={booking.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}
              >
                {/* Left: Tour details */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  {tour.imageUrl && (
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      style={{ width: '80px', height: '64px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>
                        #{booking.id}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {tour.title || 'Тур'}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> {tour.country}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {tour.startDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={13} /> {booking.peopleCount} {booking.peopleCount === 1 ? 'особа' : 'особи'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Payment Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>
                      Сума до сплати
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                      ${booking.totalPrice}
                    </span>
                    {booking.discountPercent > 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'block', fontWeight: '600' }}>
                        Знижка {booking.discountPercent}% врахована
                      </span>
                    )}
                  </div>

                  {isAwaitingPayment ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => onPayBooking(booking)}
                    >
                      <CreditCard size={16} />
                      Оплатити тур
                    </button>
                  ) : booking.status === 'PAID' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: '600' }}>
                      <CheckCircle2 size={18} />
                      Успішно оплачено
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
