import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  Flame,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TourModal = ({ tour, onClose, onBookingSuccess }) => {
  const { user, isClient } = useAuth();
  const [peopleCount, setPeopleCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!tour) return null;

  const clientDiscount = (isClient && user?.clientProfile?.discountPercent) || 0;
  const basePricePerPerson = tour.pricePerPerson;
  const subtotal = basePricePerPerson * peopleCount;
  const discountAmount = clientDiscount > 0 ? (subtotal * clientDiscount) / 100 : 0;
  const finalPrice = Math.round((subtotal - discountAmount) * 100) / 100;

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      await onBookingSuccess({
        tourId: tour.id,
        clientId: user?.clientProfile?.id || 1,
        peopleCount: Number(peopleCount),
        discountPercent: clientDiscount,
        totalPrice: finalPrice
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Помилка при створенні бронювання');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2>Бронювання туру</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>
              Ознайомтесь з деталями та підтвердіть бронювання
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Tour Brief Header */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <img
              src={tour.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
              alt={tour.title}
              style={{ width: '100px', height: '80px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', alignItems: 'center' }}>
                <span className="role-pill client" style={{ textTransform: 'none' }}>
                  {tour.tourType === 'VACATION' ? 'Відпочинок' : tour.tourType === 'EXCURSION' ? 'Екскурсія' : 'Шопінг'}
                </span>
                {tour.burningTour && (
                  <span className="badge badge-burning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                    <Flame size={10} /> Палаючий тур
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {tour.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} /> {tour.country}, {tour.hotel?.city} — {tour.hotel?.name} ({tour.hotel?.stars}★)
              </p>
            </div>
          </div>

          <div className="tour-meta-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="tour-meta-item">
              <Calendar size={14} />
              <span>Виліт: <strong>{tour.startDate}</strong></span>
            </div>
            <div className="tour-meta-item">
              <Clock size={14} />
              <span>Тривалість: <strong>{tour.durationDays} днів</strong></span>
            </div>
            <div className="tour-meta-item">
              <Users size={14} />
              <span>Доступно місць: <strong>{tour.seatsAvailable}</strong></span>
            </div>
            <div className="tour-meta-item">
              <ShieldCheck size={14} />
              <span>Медичне страхування включено</span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {tour.description}
          </p>

          {/* People Count Selector */}
          <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', border: '1px solid var(--border-light)' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              Кількість мандрівників (осіб):
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ width: '36px', height: '36px', padding: 0 }}
                  onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                  disabled={peopleCount <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '70px', textAlign: 'center', fontWeight: '700' }}
                  min="1"
                  max={tour.seatsAvailable}
                  value={peopleCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= tour.seatsAvailable) setPeopleCount(val);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ width: '36px', height: '36px', padding: 0 }}
                  onClick={() => setPeopleCount(Math.min(tour.seatsAvailable, peopleCount + 1))}
                  disabled={peopleCount >= tour.seatsAvailable}
                >
                  +
                </button>
              </div>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>
                максимум {tour.seatsAvailable} місць
              </span>
            </div>
          </div>

          {/* Transparent Calculation Breakdown */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Вартість на 1 особу:</span>
              <span style={{ fontWeight: '600' }}>${basePricePerPerson}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Кількість осіб ({peopleCount}):</span>
              <span style={{ fontWeight: '600' }}>${subtotal}</span>
            </div>

            {clientDiscount > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--color-success)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                  <Percent size={14} /> Знижка постійного клієнта ({clientDiscount}%):
                </span>
                <span style={{ fontWeight: '700' }}>-${discountAmount.toFixed(2)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.825rem', color: 'var(--text-light)' }}>
                <span>Знижка клієнта:</span>
                <span>0% (немає активної знижки)</span>
              </div>
            )}

            <div style={{ borderTop: '1px dashed var(--border-medium)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Разом до сплати:</span>
              <span style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                ${finalPrice}
              </span>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Скасувати
          </button>
          <button
            className="btn btn-primary"
            onClick={handleBook}
            disabled={loading || tour.seatsAvailable <= 0}
          >
            {loading ? 'Оформлення...' : 'Підтвердити бронювання'}
          </button>
        </div>
      </div>
    </div>
  );
};
