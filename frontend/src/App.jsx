import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { TourFilters } from './components/TourFilters';
import { TourCard } from './components/TourCard';
import { TourModal } from './components/TourModal';
import { MyBookings } from './components/MyBookings';
import { PaymentModal } from './components/PaymentModal';
import { AgentDashboard } from './components/AgentDashboard';
import { AuthModal } from './components/AuthModal';
import {
  Flame,
  CheckCircle2,
  Compass,
  AlertCircle
} from 'lucide-react';

export function App() {
  const { user, isClient, isManager } = useAuth();

  // Navigation: 'tours' | 'burning' | 'bookings' | 'agent'
  const [currentView, setCurrentView] = useState('tours');

  // Filter States
  const [selectedType, setSelectedType] = useState(''); // '' | 'VACATION' | 'EXCURSION' | 'SHOPPING'
  const [onlyBurning, setOnlyBurning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Tours Data State
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedTourForBooking, setSelectedTourForBooking] = useState(null);
  const [bookingForPayment, setBookingForPayment] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Tours
  const fetchTours = async () => {
    setLoading(true);
    try {
      const burningParam = currentView === 'burning' ? true : (onlyBurning ? true : undefined);
      const typeParam = selectedType || undefined;
      const data = await api.tours.getAll({ type: typeParam, burning: burningParam });
      setTours(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'tours' || currentView === 'burning') {
      fetchTours();
    }
  }, [selectedType, onlyBurning, currentView]);

  // Handle Booking Creation
  const handleBookingSuccess = async (bookingData) => {
    try {
      const client = user?.clientProfile;
      const created = await api.bookings.create(bookingData, client);
      showToast(`Тур «${selectedTourForBooking?.title}» успішно заброньовано! Замовлення #${created.id}`);
      // Open payment modal right after booking
      setBookingForPayment(created);
      fetchTours();
    } catch (err) {
      showToast(err.message || 'Помилка бронювання');
    }
  };

  const handleSelectTour = (tour) => {
    if (!user) {
      setShowAuthModal(true);
      showToast('Увійдіть або зареєструйтесь для оформлення бронювання');
      return;
    }
    setSelectedTourForBooking(tour);
  };

  // Filter & Search & Sort Pipeline
  const filteredTours = tours
    .filter(t => {
      if (currentView === 'burning' && !t.burningTour) return false;
      if (onlyBurning && !t.burningTour) return false;
      if (selectedType && t.tourType !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = t.title?.toLowerCase().includes(q);
        const inCountry = t.country?.toLowerCase().includes(q);
        const inCity = t.hotel?.city?.toLowerCase().includes(q);
        const inHotel = t.hotel?.name?.toLowerCase().includes(q);
        return inTitle || inCountry || inCity || inHotel;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerPerson - b.pricePerPerson;
      if (sortBy === 'price-desc') return b.pricePerPerson - a.pricePerPerson;
      if (sortBy === 'duration') return b.durationDays - a.durationDays;
      return 0;
    });

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'burning') {
            setOnlyBurning(true);
          } else if (view === 'tours') {
            setOnlyBurning(false);
          }
        }}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          border: '1px solid #334155',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {/* VIEW 1 & 2: TOURS CATALOG & BURNING TOURS */}
        {(currentView === 'tours' || currentView === 'burning') && (
          <div>
            {/* Hero Banner */}
            <div className="page-hero">
              <div className="page-hero-text">
                <h1>
                  {currentView === 'burning' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-burning)' }}>
                      <Flame size={28} /> Гарячі та палаючі тури
                    </span>
                  ) : (
                    'Відкрийте світ з турагентством «Мандрівник»'
                  )}
                </h1>
                <p>
                  {currentView === 'burning'
                    ? 'Спеціальні пропозиції з обмеженим терміном дії за вигідними цінами від наших турагентів.'
                    : 'Оберіть ідеальний відпочинок на морі, пізнавальну екскурсію або шопінг-тур світовими столицями моди.'}
                </p>
              </div>

              {/* Client Discount Banner if applicable */}
              {isClient && user?.clientProfile?.discountPercent > 0 && (
                <div style={{
                  background: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{ width: '36px', height: '36px', background: 'var(--color-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                    %{user.clientProfile.discountPercent}
                  </div>
                  <div>
                    <span style={{ fontWeight: '700', color: 'var(--color-success)', fontSize: '0.9rem', display: 'block' }}>
                      Постійний клієнт: активна знижка {user.clientProfile.discountPercent}%
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Знижку встановлено турагентом і вона автоматично застосовується до кожного туру.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            <TourFilters
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onlyBurning={currentView === 'burning' ? true : onlyBurning}
              onToggleBurning={() => setOnlyBurning(!onlyBurning)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Tours Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Завантаження турів...
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="empty-state">
                <Compass className="empty-state-icon" />
                <h3>Турів за вказаними параметрами не знайдено</h3>
                <p>Спробуйте скинути фільтри або обрати іншу категорію відпочинку.</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSelectedType('');
                    setOnlyBurning(false);
                    setSearchQuery('');
                  }}
                >
                  Скинути всі фільтри
                </button>
              </div>
            ) : (
              <div className="tours-grid">
                {filteredTours.map(tour => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    onSelectTour={handleSelectTour}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MY BOOKINGS (CLIENT) */}
        {currentView === 'bookings' && (
          <MyBookings
            onPayBooking={(booking) => setBookingForPayment(booking)}
          />
        )}

        {/* VIEW 4: AGENT DASHBOARD (MANAGER / ADMIN) */}
        {currentView === 'agent' && (
          <AgentDashboard />
        )}
      </main>

      {/* Modal: Book Tour */}
      {selectedTourForBooking && (
        <TourModal
          tour={selectedTourForBooking}
          onClose={() => setSelectedTourForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Modal: Online Payment */}
      {bookingForPayment && (
        <PaymentModal
          booking={bookingForPayment}
          onClose={() => setBookingForPayment(null)}
          onPaymentSuccess={() => {
            showToast(`Замовлення #${bookingForPayment.id} успішно оплачено! Дякуємо за покупку.`);
            fetchTours();
          }}
        />
      )}

      {/* Modal: Authentication */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;
