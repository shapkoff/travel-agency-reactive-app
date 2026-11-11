import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Flame,
  Briefcase,
  Ticket,
  User,
  LogOut,
  LogIn,
  Percent
} from 'lucide-react';

export const Navbar = ({ currentView, onViewChange, onOpenAuth }) => {
  const { user, isClient, isManager, isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => onViewChange('tours')}>
          <div className="brand-icon">
            <Compass size={22} />
          </div>
          <div>
            <span className="brand-title">Турагентство «Мандрівник»</span>
            <span className="brand-tagline">Система бронювання та управління турами</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item ${currentView === 'tours' ? 'active' : ''}`}
                onClick={() => onViewChange('tours')}
              >
                <Compass size={17} />
                Каталог турів
              </button>
            </li>

            <li>
              <button
                className={`nav-item ${currentView === 'burning' ? 'active' : ''}`}
                onClick={() => onViewChange('burning')}
              >
                <Flame size={17} color="#d97706" />
                Гарячі тури
                <span className="nav-item-badge">HOT</span>
              </button>
            </li>

            {isClient && (
              <li>
                <button
                  className={`nav-item ${currentView === 'bookings' ? 'active' : ''}`}
                  onClick={() => onViewChange('bookings')}
                >
                  <Ticket size={17} />
                  Мої замовлення
                </button>
              </li>
            )}

            {isManager && (
              <li>
                <button
                  className={`nav-item ${currentView === 'agent' ? 'active' : ''}`}
                  onClick={() => onViewChange('agent')}
                >
                  <Briefcase size={17} />
                  Панель турагента
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Section: Only User Profile or Login/Register Button */}
        <div className="navbar-right">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Regular Customer Discount Chip */}
              {isClient && user.clientProfile?.isRegular && user.clientProfile?.discountPercent > 0 && (
                <span className="discount-chip" title="Ваша знижка постійного клієнта">
                  <Percent size={12} />
                  Знижка {user.clientProfile.discountPercent}%
                </span>
              )}

              {/* User profile badge */}
              <div className="user-profile-badge">
                <User size={14} />
                <span>{user.clientProfile?.firstName || user.username}</span>
                <span className={`role-pill ${isManager ? 'manager' : isAdmin ? 'admin' : 'client'}`}>
                  {isManager ? 'Турагент' : isAdmin ? 'Адмін' : 'Клієнт'}
                </span>
              </div>

              {/* Logout button */}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  logout();
                  onViewChange('tours');
                }}
                title="Вийти з акаунта"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogOut size={15} />
                Вихід
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
              <LogIn size={15} />
              Вхід / Реєстрація
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
