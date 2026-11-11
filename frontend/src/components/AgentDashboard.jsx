import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Briefcase,
  Flame,
  Users,
  Percent,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Ticket,
  Calendar,
  Save,
  Palmtree,
  Landmark,
  ShoppingBag
} from 'lucide-react';

export const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('tours'); // 'tours' | 'clients' | 'bookings'

  // Data states
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // New Tour Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTour, setNewTour] = useState({
    title: '',
    country: '',
    hotelId: 1,
    tourType: 'VACATION',
    startDate: '2026-12-01',
    durationDays: 7,
    pricePerPerson: 400,
    seatsAvailable: 15,
    burningTour: false,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: ''
  });

  // Load all initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [toursData, hotelsData, clientsData, bookingsData] = await Promise.all([
        api.tours.getAll(),
        api.hotels.getAll(),
        api.clients.getAll(),
        api.bookings.getAll()
      ]);
      setTours(toursData || []);
      setHotels(hotelsData || []);
      setClients(clientsData || []);
      setBookings(bookingsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- 1. Toggle Burning Tour ---
  const handleToggleBurning = async (tourId, currentStatus) => {
    try {
      const updated = await api.tours.toggleBurning(tourId, !currentStatus);
      setTours(prev => prev.map(t => (t.id === tourId ? { ...t, burningTour: !currentStatus } : t)));
      notify(`Статус «Палаючий тур» для туру #${tourId} змінено на: ${!currentStatus ? '🔥 ТАК' : 'Ні'}`);
    } catch (err) {
      notify('Помилка при зміні статусу туру');
    }
  };

  // --- 2. Add New Tour ---
  const handleCreateTour = async (e) => {
    e.preventDefault();
    try {
      const created = await api.tours.create(newTour);
      if (created) {
        setTours(prev => [created, ...prev.filter(t => t.id !== created.id)]);
      }
      notify('Новий тур успішно створено!');
      setShowAddModal(false);
      setNewTour({
        title: '',
        country: '',
        hotelId: hotels[0]?.id || 1,
        tourType: 'VACATION',
        startDate: '2026-12-01',
        durationDays: 7,
        pricePerPerson: 400,
        seatsAvailable: 15,
        burningTour: false,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        description: ''
      });
      loadData();
    } catch (err) {
      notify('Помилка при створенні туру: ' + (err.message || ''));
    }
  };

  // --- 3. Delete Tour ---
  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей тур?')) return;
    try {
      await api.tours.delete(tourId);
      setTours(prev => prev.filter(t => t.id !== tourId));
      notify(`Тур #${tourId} успішно видалено`);
    } catch (err) {
      notify('Помилка при видаленні туру');
    }
  };

  // --- 4. Update Client Discount & Regular Status ---
  const handleSaveClientDiscount = async (clientId, discountPercent, isRegular) => {
    try {
      await api.clients.updateDiscount(clientId, Number(discountPercent), isRegular);
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, discountPercent: Number(discountPercent), isRegular } : c));
      notify(`Знижку для клієнта #${clientId} збережено: ${discountPercent}% (Постійний: ${isRegular ? 'Так' : 'Ні'})`);
    } catch (err) {
      notify('Помилка при збереженні знижки клієнта');
    }
  };

  // --- 5. Update Booking Status ---
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await api.bookings.updateStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      notify(`Статус замовлення #${bookingId} змінено на ${newStatus}`);
    } catch (err) {
      notify('Помилка при оновленні статусу');
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-text">
          <h1>Робоча панель турагента</h1>
          <p>
            Визначення турів як «палаючі», встановлення індивідуальних розмірів знижок постійним клієнтам, моніторинг бронювань.
          </p>
        </div>
        {activeTab === 'tours' && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Додати новий тур
          </button>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)', padding: '0.75rem 1.25rem', marginBottom: '1.25rem', fontWeight: '600' }}>
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'tours' ? 'active' : ''}`}
          onClick={() => setActiveTab('tours')}
        >
          <Flame size={18} />
          Керування турами ({tours.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <Percent size={18} />
          Клієнти та знижки постійним клієнтам ({clients.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Ticket size={18} />
          Всі замовлення ({bookings.length})
        </button>
      </div>

      {/* TAB 1: TOURS MANAGEMENT & BURNING TOGGLE */}
      {activeTab === 'tours' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва та Країна</th>
                <th>Тип туру</th>
                <th>Готель</th>
                <th>Ціна / особа</th>
                <th>Вільних місць</th>
                <th>Палаючий тур 🔥</th>
                <th style={{ textAlign: 'right' }}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {tours.map(tour => (
                <tr key={tour.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>#{tour.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{tour.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tour.country} • {tour.startDate} ({tour.durationDays} дн.)</div>
                  </td>
                  <td>
                    <span className="role-pill client" style={{ textTransform: 'none' }}>
                      {tour.tourType === 'VACATION' ? '🏖️ Відпочинок' : tour.tourType === 'EXCURSION' ? '🏛️ Екскурсія' : '🛍️ Шопінг'}
                    </span>
                  </td>
                  <td>{tour.hotel?.name || 'Готель'} ({tour.hotel?.stars || 4}★)</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>${tour.pricePerPerson}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: tour.seatsAvailable > 5 ? 'inherit' : 'var(--color-danger)' }}>
                      {tour.seatsAvailable}
                    </span>
                  </td>
                  <td>
                    {/* Fast burning toggle switch */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={tour.burningTour}
                          onChange={() => handleToggleBurning(tour.id, tour.burningTour)}
                        />
                        <span className="slider" />
                      </label>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: tour.burningTour ? 'var(--color-burning)' : 'var(--text-light)' }}>
                        {tour.burningTour ? '🔥 Палаючий' : 'Звичайний'}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline btn-sm btn-icon"
                      onClick={() => handleDeleteTour(tour.id)}
                      title="Видалити тур"
                    >
                      <Trash2 size={15} color="var(--color-danger)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CLIENTS & REGULAR CLIENT DISCOUNTS */}
      {activeTab === 'clients' && (
        <div>
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            💡 <strong>Підказка для турагента:</strong> Тут ви можете призначати клієнтам статус <em>«Постійний клієнт»</em> та індивідуальні відсотки знижок (наприклад 5%, 10%, 15%). При оформленні будь-якого туру цим клієнтом знижка розраховується та застосовується автоматично!
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Клієнт (ПІБ)</th>
                  <th>Контакти</th>
                  <th>Статус</th>
                  <th>Розмір знижки (%)</th>
                  <th style={{ textAlign: 'right' }}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    onSaveDiscount={handleSaveClientDiscount}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ALL BOOKINGS OVERVIEW */}
      {activeTab === 'bookings' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Клієнт</th>
                <th>Тур</th>
                <th>Осіб</th>
                <th>Знижка</th>
                <th>Сума</th>
                <th>Статус</th>
                <th style={{ textAlign: 'right' }}>Зміна статусу</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace' }}>#{b.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.client?.firstName} {b.client?.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{b.client?.phone || b.client?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.tour?.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.tour?.country}</div>
                  </td>
                  <td>{b.peopleCount}</td>
                  <td>
                    {b.discountPercent > 0 ? (
                      <span className="discount-chip">-{b.discountPercent}%</span>
                    ) : '0%'}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>${b.totalPrice}</td>
                  <td>
                    <span className="role-pill" style={{
                      backgroundColor: b.status === 'PAID' ? 'var(--color-success-bg)' : b.status === 'CONFIRMED' ? '#eff6ff' : b.status === 'CANCELLED' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                      color: b.status === 'PAID' ? 'var(--color-success)' : b.status === 'CONFIRMED' ? '#1d4ed8' : b.status === 'CANCELLED' ? 'var(--color-danger)' : 'var(--color-warning)'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      {b.status !== 'CONFIRMED' && (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => handleBookingStatusChange(b.id, 'CONFIRMED')}
                        >
                          Підтвердити
                        </button>
                      )}
                      {b.status !== 'CANCELLED' && (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--color-danger)' }}
                          onClick={() => handleBookingStatusChange(b.id, 'CANCELLED')}
                        >
                          Скасувати
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add New Tour */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Створення нового туру</h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTour}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Назва туру</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTour.title}
                    onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                    placeholder="наприклад: Сонячний Крит — Релакс & Море"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Тип туру</label>
                    <select
                      className="form-select"
                      value={newTour.tourType}
                      onChange={(e) => setNewTour({ ...newTour, tourType: e.target.value })}
                    >
                      <option value="VACATION">🏖️ Відпочинок</option>
                      <option value="EXCURSION">🏛️ Екскурсія</option>
                      <option value="SHOPPING">🛍️ Шопінг</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Країна</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTour.country}
                      onChange={(e) => setNewTour({ ...newTour, country: e.target.value })}
                      placeholder="Греція"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Готель</label>
                    <select
                      className="form-select"
                      value={newTour.hotelId}
                      onChange={(e) => setNewTour({ ...newTour, hotelId: Number(e.target.value) })}
                    >
                      {(hotels.length > 0 ? hotels : [
                        { id: 1, name: 'Rixos Premium Belek', city: 'Анталія', stars: 5 },
                        { id: 2, name: 'Hilton Diagonal Mar', city: 'Барселона', stars: 4 },
                        { id: 3, name: 'Grand Hotel et de Milan', city: 'Мілан', stars: 5 },
                        { id: 4, name: 'Royal Savoy Sharm', city: 'Шарм-ель-Шейх', stars: 5 },
                        { id: 5, name: 'Hotel Le Louvre Rivoli', city: 'Париж', stars: 4 },
                        { id: 6, name: 'The Marmara Taksim', city: 'Стамбул', stars: 5 }
                      ]).map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.city}, {h.stars}★)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Дата початку</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTour.startDate}
                      onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Тривалість (днів)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      value={newTour.durationDays}
                      onChange={(e) => setNewTour({ ...newTour, durationDays: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ціна за 1 особу ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      min="1"
                      value={newTour.pricePerPerson}
                      onChange={(e) => setNewTour({ ...newTour, pricePerPerson: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Кількість місць</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      value={newTour.seatsAvailable}
                      onChange={(e) => setNewTour({ ...newTour, seatsAvailable: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Опис туру</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={newTour.description}
                    onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                    placeholder="Детальний опис програми відпочинку, екскурсій або шопінгу..."
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-burning-bg)', padding: '0.75rem 1rem', border: '1px solid var(--color-burning-border)' }}>
                  <input
                    type="checkbox"
                    id="newTourBurning"
                    checked={newTour.burningTour}
                    onChange={(e) => setNewTour({ ...newTour, burningTour: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="newTourBurning" style={{ fontWeight: 600, color: 'var(--color-burning)', cursor: 'pointer' }}>
                    🔥 Позначити цей тур як «Палаючий» зі знижкою
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Скасувати
                </button>
                <button type="submit" className="btn btn-primary">
                  Створити тур
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for client row to allow local editing of regular status and discount
const ClientRow = ({ client, onSaveDiscount }) => {
  const [discount, setDiscount] = useState(client.discountPercent || 0);
  const [isRegular, setIsRegular] = useState(!!client.isRegular);
  const [dirty, setDirty] = useState(false);

  return (
    <tr>
      <td style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>#{client.id}</td>
      <td>
        <div style={{ fontWeight: 600 }}>{client.firstName} {client.lastName}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.middleName}</div>
      </td>
      <td>
        <div>{client.email}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{client.phone}</div>
      </td>
      <td>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
          <input
            type="checkbox"
            checked={isRegular}
            onChange={(e) => {
              setIsRegular(e.target.checked);
              setDirty(true);
            }}
          />
          <span style={{ fontWeight: 600, color: isRegular ? 'var(--color-primary)' : 'var(--text-muted)' }}>
            {isRegular ? 'Постійний клієнт' : 'Звичайний'}
          </span>
        </label>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            className="form-input"
            style={{ width: '75px', padding: '0.35rem 0.5rem', textAlign: 'center', fontWeight: '700' }}
            value={discount}
            onChange={(e) => {
              setDiscount(e.target.value);
              setDirty(true);
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>%</span>

          {/* Quick preset chips */}
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {[5, 10, 15, 20].map(pct => (
              <button
                key={pct}
                type="button"
                className="btn btn-outline btn-sm"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                onClick={() => {
                  setDiscount(pct);
                  setIsRegular(true);
                  setDirty(true);
                }}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </td>
      <td style={{ textAlign: 'right' }}>
        <button
          className={`btn btn-sm ${dirty ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            onSaveDiscount(client.id, discount, isRegular);
            setDirty(false);
          }}
          title="Зберегти зміни знижки для цього клієнта"
        >
          <Save size={14} /> Зберегти
        </button>
      </td>
    </tr>
  );
};
