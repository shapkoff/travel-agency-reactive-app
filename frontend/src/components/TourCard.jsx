import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Flame,
  Star,
  Palmtree,
  Landmark,
  ShoppingBag,
  Percent
} from 'lucide-react';

export const TourCard = ({ tour, onSelectTour }) => {
  const { user, isClient } = useAuth();
  const clientDiscount = (isClient && user?.clientProfile?.discountPercent) || 0;

  const basePrice = tour.pricePerPerson;
  const discountedPrice = clientDiscount > 0
    ? Math.round(basePrice * (1 - clientDiscount / 100) * 100) / 100
    : basePrice;

  const renderTypeBadge = () => {
    switch (tour.tourType) {
      case 'VACATION':
        return (
          <span className="badge badge-vacation">
            <Palmtree size={12} /> Відпочинок
          </span>
        );
      case 'EXCURSION':
        return (
          <span className="badge badge-excursion">
            <Landmark size={12} /> Екскурсія
          </span>
        );
      case 'SHOPPING':
        return (
          <span className="badge badge-shopping">
            <ShoppingBag size={12} /> Шопінг
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tour-card">
      {/* Tour Image */}
      <div className="tour-card-image-wrap">
        <img
          src={tour.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={tour.title}
          className="tour-card-image"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="card-badges">
          {renderTypeBadge()}
          {tour.burningTour && (
            <span className="badge badge-burning">
              <Flame size={12} /> Палаючий тур
            </span>
          )}
        </div>

        {/* Hotel Stars */}
        {tour.hotel?.stars && (
          <div className="badge-stars">
            <Star size={13} fill="#facc15" stroke="none" />
            <span>{tour.hotel.stars}★ {tour.hotel.name}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="tour-card-body">
        <h3 className="tour-title">{tour.title}</h3>

        <div className="tour-location">
          <MapPin size={14} />
          <span>{tour.country}, {tour.hotel?.city || ''}</span>
        </div>

        <div className="tour-meta-grid">
          <div className="tour-meta-item">
            <Clock size={14} />
            <span>{tour.durationDays} днів / {tour.durationDays - 1} ночей</span>
          </div>
          <div className="tour-meta-item">
            <Calendar size={14} />
            <span>{tour.startDate}</span>
          </div>
          <div className="tour-meta-item">
            <Users size={14} />
            <span>Вільних місць: <strong>{tour.seatsAvailable}</strong></span>
          </div>
          <div className="tour-meta-item">
            <Star size={14} />
            <span>{tour.hotel?.stars || 4} зірки</span>
          </div>
        </div>

        <p className="tour-description">{tour.description}</p>

        {/* Footer with Price and Booking Button */}
        <div className="tour-card-footer">
          <div className="price-container">
            <span className="price-label">Вартість за особу</span>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className="price-val">${discountedPrice}</span>
              {clientDiscount > 0 && (
                <span className="price-old">${basePrice}</span>
              )}
            </div>
            {clientDiscount > 0 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600' }}>
                Враховано вашу знижку {clientDiscount}%
              </span>
            )}
          </div>

          <button
            className={`btn ${tour.burningTour ? 'btn-burning' : 'btn-primary'}`}
            onClick={() => onSelectTour(tour)}
            disabled={tour.seatsAvailable <= 0}
          >
            {tour.seatsAvailable > 0 ? 'Забронювати' : 'Немає місць'}
          </button>
        </div>
      </div>
    </div>
  );
};
