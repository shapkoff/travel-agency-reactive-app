// ============================================================================
// Travel Agency API Service
// Connects to Spring Boot WebFlux API (/tours, /bookings, /clients, /payments)
// with seamless reactive fallback storage if backend is offline.
// ============================================================================

const API_BASE_URL = 'http://localhost:8080';

// Initial Mock Seed Data matching backend seed data
const INITIAL_HOTELS = [
  { id: 1, name: 'Rixos Premium Belek', city: 'Анталія', stars: 5 },
  { id: 2, name: 'Hilton Diagonal Mar', city: 'Барселона', stars: 4 },
  { id: 3, name: 'Grand Hotel et de Milan', city: 'Мілан', stars: 5 },
  { id: 4, name: 'Royal Savoy Sharm', city: 'Шарм-ель-Шейх', stars: 5 },
  { id: 5, name: 'Hotel Le Louvre Rivoli', city: 'Париж', stars: 4 },
  { id: 6, name: 'The Marmara Taksim', city: 'Стамбул', stars: 5 }
];

const INITIAL_TOURS = [
  {
    id: 1,
    title: 'Казкова Анталія — All Inclusive',
    country: 'Туреччина',
    hotelId: 1,
    hotel: { id: 1, name: 'Rixos Premium Belek', city: 'Анталія', stars: 5 },
    startDate: '2026-11-20',
    durationDays: 7,
    pricePerPerson: 450,
    seatsAvailable: 18,
    burningTour: true,
    tourType: 'VACATION',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Преміальний відпочинок на Середземному морі в готелі 5 зірок. Харчування Ultra All Inclusive, власний піщаний пляж, SPA-комплекс та аквапарк.'
  },
  {
    id: 2,
    title: 'Перлини Парижа: Лувр, Версаль та Ейфелева Вежа',
    country: 'Франція',
    hotelId: 5,
    hotel: { id: 5, name: 'Hotel Le Louvre Rivoli', city: 'Париж', stars: 4 },
    startDate: '2026-11-22',
    durationDays: 5,
    pricePerPerson: 390,
    seatsAvailable: 15,
    burningTour: true,
    tourType: 'EXCURSION',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'Насичена екскурсійна програма серцем Франції: відвідування музею Лувр з гідом, підйом на Монмартр, романтичний круїз Сеною.'
  },
  {
    id: 3,
    title: 'Міланський шопінг-вікенд: Serravalle Outlet & Galleria',
    country: 'Італія',
    hotelId: 3,
    hotel: { id: 3, name: 'Grand Hotel et de Milan', city: 'Мілан', stars: 5 },
    startDate: '2026-11-18',
    durationDays: 4,
    pricePerPerson: 320,
    seatsAvailable: 8,
    burningTour: true,
    tourType: 'SHOPPING',
    imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    description: 'Подорож до світової столиці моди! Трансфер до найбільшого аутлету Serravalle з знижками до -70%, персональні консультації та кава у Галереї.'
  },
  {
    id: 4,
    title: 'Сонячний Шарм-ель-Шейх: Червоне Море та Корали',
    country: 'Єгипет',
    hotelId: 4,
    hotel: { id: 4, name: 'Royal Savoy Sharm', city: 'Шарм-ель-Шейх', stars: 5 },
    startDate: '2026-11-28',
    durationDays: 10,
    pricePerPerson: 520,
    seatsAvailable: 14,
    burningTour: false,
    tourType: 'VACATION',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Відпочинок у затишній бухті з неймовірним живим кораловим рифом. Дайвінг, снорклінг, вечірні шоу та розкішний сервіс.'
  },
  {
    id: 5,
    title: 'Шедеври Гауді та Готичний квартал Барселони',
    country: 'Іспанія',
    hotelId: 2,
    hotel: { id: 2, name: 'Hilton Diagonal Mar', city: 'Барселона', stars: 4 },
    startDate: '2026-12-02',
    durationDays: 6,
    pricePerPerson: 430,
    seatsAvailable: 12,
    burningTour: false,
    tourType: 'EXCURSION',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    description: 'Архітектурна подорож: собор Саграда Фамілія, парк Гуель, прогулянка лабіринтами Готичного кварталу та шоу магічних фонтанів.'
  },
  {
    id: 6,
    title: 'Гранд-Базар та сучасні аутлети Стамбула',
    country: 'Туреччина',
    hotelId: 6,
    hotel: { id: 6, name: 'The Marmara Taksim', city: 'Стамбул', stars: 5 },
    startDate: '2026-11-25',
    durationDays: 4,
    pricePerPerson: 280,
    seatsAvailable: 16,
    burningTour: false,
    tourType: 'SHOPPING',
    imageUrl: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    description: 'Шопінг у найкращих моллах Mall of Istanbul та Zorlu Center, колоритний базар спецій, турецькі солодощі та текстильні бутики.'
  }
];

const INITIAL_CLIENTS = [
  {
    id: 1,
    userId: 1,
    firstName: 'Олена',
    lastName: 'Коваленко',
    middleName: 'Сергіївна',
    email: 'olena.kovalenko@example.com',
    phone: '+380501234567',
    age: 29,
    discountPercent: 10.0,
    isRegular: true
  },
  {
    id: 2,
    userId: 2,
    firstName: 'Максим',
    lastName: 'Бондаренко',
    middleName: 'Ігорович',
    email: 'm.bondarenko@example.com',
    phone: '+380679876543',
    age: 35,
    discountPercent: 5.0,
    isRegular: true
  },
  {
    id: 3,
    userId: 3,
    firstName: 'Юлія',
    lastName: 'Мельник',
    middleName: 'Олегівна',
    email: 'yulia.melnyk@example.com',
    phone: '+380931122334',
    age: 24,
    discountPercent: 0.0,
    isRegular: false
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 101,
    clientId: 1,
    tourId: 1,
    peopleCount: 2,
    discountPercent: 10.0,
    totalPrice: 810.0,
    status: 'PAID',
    tour: INITIAL_TOURS[0],
    client: INITIAL_CLIENTS[0]
  },
  {
    id: 102,
    clientId: 1,
    tourId: 2,
    peopleCount: 1,
    discountPercent: 10.0,
    totalPrice: 351.0,
    status: 'NEW',
    tour: INITIAL_TOURS[1],
    client: INITIAL_CLIENTS[0]
  }
];

// In-Memory Storage for Demo Fallback
class LocalReactiveStore {
  constructor() {
    this.tours = JSON.parse(localStorage.getItem('ta_demo_tours')) || INITIAL_TOURS;
    this.hotels = JSON.parse(localStorage.getItem('ta_demo_hotels')) || INITIAL_HOTELS;
    this.clients = JSON.parse(localStorage.getItem('ta_demo_clients')) || INITIAL_CLIENTS;
    this.bookings = JSON.parse(localStorage.getItem('ta_demo_bookings')) || INITIAL_BOOKINGS;
    this.payments = JSON.parse(localStorage.getItem('ta_demo_payments')) || [];
  }

  save() {
    localStorage.setItem('ta_demo_tours', JSON.stringify(this.tours));
    localStorage.setItem('ta_demo_hotels', JSON.stringify(this.hotels));
    localStorage.setItem('ta_demo_clients', JSON.stringify(this.clients));
    localStorage.setItem('ta_demo_bookings', JSON.stringify(this.bookings));
    localStorage.setItem('ta_demo_payments', JSON.stringify(this.payments));
  }

  getTours(type, burning) {
    let result = [...this.tours];
    if (type) {
      result = result.filter(t => t.tourType === type);
    }
    if (burning !== undefined && burning !== null) {
      result = result.filter(t => t.burningTour === burning);
    }
    return result;
  }

  toggleBurning(id, burning) {
    const tour = this.tours.find(t => t.id === Number(id));
    if (tour) {
      tour.burningTour = burning !== undefined ? burning : !tour.burningTour;
      this.save();
      return { ...tour };
    }
    throw new Error('Tour not found');
  }

  addTour(tourData) {
    const newId = this.tours.length ? Math.max(...this.tours.map(t => Number(t.id) || 0)) + 1 : 1;
    const hotel = this.hotels.find(h => h.id === Number(tourData.hotelId)) || this.hotels[0];
    const newTour = {
      ...tourData,
      id: newId,
      hotelId: hotel ? hotel.id : 1,
      hotel: hotel,
      burningTour: !!tourData.burningTour,
      seatsAvailable: Number(tourData.seatsAvailable) || 10,
      pricePerPerson: Number(tourData.pricePerPerson) || 100,
      durationDays: Number(tourData.durationDays) || 7,
      imageUrl: tourData.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    };
    this.tours.unshift(newTour);
    this.save();
    return newTour;
  }

  updateTour(id, tourData) {
    const index = this.tours.findIndex(t => t.id === Number(id));
    if (index !== -1) {
      const hotel = this.hotels.find(h => h.id === Number(tourData.hotelId)) || this.tours[index].hotel;
      this.tours[index] = { ...this.tours[index], ...tourData, hotel };
      this.save();
      return this.tours[index];
    }
    throw new Error('Tour not found');
  }

  deleteTour(id) {
    this.tours = this.tours.filter(t => t.id !== Number(id));
    this.save();
    return true;
  }

  getClients() {
    return [...this.clients];
  }

  updateClientDiscount(id, discountPercent, isRegular) {
    const client = this.clients.find(c => c.id === Number(id));
    if (client) {
      if (discountPercent !== undefined) client.discountPercent = Number(discountPercent);
      if (isRegular !== undefined) client.isRegular = !!isRegular;
      this.save();
      return { ...client };
    }
    throw new Error('Client not found');
  }

  getBookings(clientId) {
    if (clientId) {
      return this.bookings.filter(b => b.clientId === Number(clientId));
    }
    return [...this.bookings];
  }

  addBooking(bookingData, currentClient) {
    const tour = this.tours.find(t => t.id === Number(bookingData.tourId));
    if (!tour) throw new Error('Тур не знайдено');
    if (tour.seatsAvailable < bookingData.peopleCount) throw new Error('Недостатньо місць у турі');

    const client = currentClient || this.clients.find(c => c.id === Number(bookingData.clientId)) || this.clients[0];
    const discount = client ? (client.discountPercent || 0) : 0;
    const peopleCount = Number(bookingData.peopleCount) || 1;
    const basePrice = tour.pricePerPerson * peopleCount;
    const totalPrice = Math.round(basePrice * (1 - discount / 100) * 100) / 100;

    tour.seatsAvailable -= peopleCount;

    const newBooking = {
      id: Date.now(),
      clientId: client.id,
      tourId: tour.id,
      peopleCount,
      discountPercent: discount,
      totalPrice,
      status: 'NEW',
      tour: { ...tour },
      client: { ...client }
    };

    this.bookings.unshift(newBooking);
    this.save();
    return newBooking;
  }

  updateBookingStatus(id, status) {
    const booking = this.bookings.find(b => b.id === Number(id));
    if (booking) {
      booking.status = status;
      this.save();
      return { ...booking };
    }
    throw new Error('Booking not found');
  }

  addPayment(bookingId, amount) {
    const booking = this.bookings.find(b => b.id === Number(bookingId));
    if (!booking) throw new Error('Booking not found');

    const payment = {
      id: Date.now(),
      bookingId: Number(bookingId),
      amount: Number(amount),
      paidAt: new Date().toISOString()
    };

    booking.status = 'PAID';
    this.payments.push(payment);
    this.save();
    return payment;
  }
}

const localStore = new LocalReactiveStore();
let isBackendLive = null; // null = untested, true = live, false = offline

// Helper for making fetch requests with JWT
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ta_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    isBackendLive = true;

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson = null;
      try { errorJson = JSON.parse(errorText); } catch(e) {}
      throw new Error(errorJson?.message || errorText || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null;
    return await response.json();
  } catch (err) {
    // If backend is unreachable, toggle fallback
    isBackendLive = false;
    throw err;
  }
}

// Exported unified API
export const api = {
  checkBackendStatus: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hello`, { method: 'GET' });
      isBackendLive = res.ok;
      return isBackendLive;
    } catch {
      isBackendLive = false;
      return false;
    }
  },

  isLive: () => isBackendLive,

  // --- Auth ---
  auth: {
    login: async (username, password) => {
      try {
        const data = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
        if (data.token) {
          localStorage.setItem('ta_jwt_token', data.token);
        }
        return data;
      } catch (err) {
        // Fallback demo credentials
        if (username === 'manager' && password === 'manager123') {
          return {
            token: 'demo_token_manager',
            username: 'manager',
            roles: ['ROLE_MANAGER'],
            userId: 2,
            clientId: null
          };
        } else if (username === 'admin' && password === 'admin123') {
          return {
            token: 'demo_token_admin',
            username: 'admin',
            roles: ['ROLE_ADMIN'],
            userId: 3,
            clientId: null
          };
        } else {
          // Default client demo
          const client = localStore.clients[0];
          return {
            token: 'demo_token_client',
            username: username || 'olena',
            roles: ['ROLE_CLIENT'],
            userId: 1,
            clientId: client.id
          };
        }
      }
    },

    register: async (username, password) => {
      try {
        return await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
      } catch (err) {
        return {
          token: 'demo_token_' + Date.now(),
          username,
          roles: ['ROLE_CLIENT'],
          userId: Date.now(),
          clientId: localStore.clients[0].id
        };
      }
    }
  },

  // --- Tours ---
  tours: {
    getAll: async ({ type, burning } = {}) => {
      try {
        let params = [];
        if (type) params.push(`type=${type}`);
        if (burning !== undefined && burning !== null) params.push(`burning=${burning}`);
        const qs = params.length ? `?${params.join('&')}` : '';
        const serverTours = await request(`/tours${qs}`);
        if (Array.isArray(serverTours)) {
          const localTours = localStore.getTours(type, burning);
          const serverIds = new Set(serverTours.map(t => Number(t.id)));
          const localOnly = localTours.filter(t => !serverIds.has(Number(t.id)));
          return [...localOnly, ...serverTours];
        }
        return localStore.getTours(type, burning);
      } catch {
        return localStore.getTours(type, burning);
      }
    },

    getById: async (id) => {
      try {
        return await request(`/tours/${id}`);
      } catch {
        return localStore.tours.find(t => t.id === Number(id));
      }
    },

    create: async (tourData) => {
      let createdTour = null;
      try {
        createdTour = await request('/tours', {
          method: 'POST',
          body: JSON.stringify(tourData)
        });
      } catch (err) {
        console.warn('Backend POST /tours failed, saving locally:', err);
      }
      const saved = localStore.addTour(createdTour || tourData);
      return createdTour || saved;
    },

    update: async (id, tourData) => {
      try {
        return await request(`/tours/${id}`, {
          method: 'PUT',
          body: JSON.stringify(tourData)
        });
      } catch {
        return localStore.updateTour(id, tourData);
      }
    },

    toggleBurning: async (id, burning) => {
      try {
        return await request(`/tours/${id}/burning`, {
          method: 'PATCH',
          body: JSON.stringify({ burning })
        });
      } catch {
        return localStore.toggleBurning(id, burning);
      }
    },

    delete: async (id) => {
      try {
        return await request(`/tours/${id}`, { method: 'DELETE' });
      } catch {
        return localStore.deleteTour(id);
      }
    }
  },

  // --- Hotels ---
  hotels: {
    getAll: async () => {
      try {
        return await request('/hotels');
      } catch {
        return localStore.hotels;
      }
    }
  },

  // --- Clients & Regular Client Discounts ---
  clients: {
    getCurrent: async () => {
      try {
        return await request('/clients/me');
      } catch {
        return localStore.clients[0];
      }
    },

    getAll: async () => {
      try {
        return await request('/clients');
      } catch {
        return localStore.getClients();
      }
    },

    updateDiscount: async (clientId, discountPercent, isRegular) => {
      try {
        return await request(`/clients/${clientId}/discount`, {
          method: 'PATCH',
          body: JSON.stringify({ discountPercent, isRegular })
        });
      } catch {
        return localStore.updateClientDiscount(clientId, discountPercent, isRegular);
      }
    }
  },

  // --- Bookings ---
  bookings: {
    getMyBookings: async () => {
      try {
        return await request('/bookings/my');
      } catch {
        return localStore.getBookings(localStore.clients[0].id);
      }
    },

    getAll: async () => {
      try {
        return await request('/bookings');
      } catch {
        return localStore.getBookings();
      }
    },

    create: async (bookingData, currentClient) => {
      try {
        return await request('/bookings', {
          method: 'POST',
          body: JSON.stringify(bookingData)
        });
      } catch {
        return localStore.addBooking(bookingData, currentClient);
      }
    },

    updateStatus: async (bookingId, status) => {
      try {
        return await request(`/bookings/${bookingId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        });
      } catch {
        return localStore.updateBookingStatus(bookingId, status);
      }
    }
  },

  // --- Payments ---
  payments: {
    create: async (bookingId, amount) => {
      try {
        return await request('/payments', {
          method: 'POST',
          body: JSON.stringify({ bookingId, amount })
        });
      } catch {
        return localStore.addPayment(bookingId, amount);
      }
    }
  }
};
