# Travel Agency Reactive App

Інформаційна система турагентства з **реактивним бекендом** на Spring Boot WebFlux + R2DBC та клієнтським веб-застосунком на React. Система дозволяє клієнтам переглядати каталог турів, бронювати їх із автоматичним розрахунком знижки та оплачувати, а менеджерам — керувати турами, клієнтами й замовленнями.

## Зміст

- [Можливості](#можливості)
- [Технологічний стек](#технологічний-стек)
- [Структура проєкту](#структура-проєкту)
- [Модель даних](#модель-даних)
- [Швидкий старт](#швидкий-старт)
- [Конфігурація](#конфігурація)
- [REST API](#rest-api)
- [Ролі та доступ](#ролі-та-доступ)
- [Фронтенд](#фронтенд)

## Можливості

**Для клієнта**
- Каталог турів за категоріями: відпочинок (`VACATION`), екскурсії (`EXCURSION`), шопінг (`SHOPPING`)
- Фільтрація, зокрема за «палаючими» турами 🔥
- Бронювання з перевіркою доступних місць та автоматичним розрахунком вартості:
  `ціна за особу × кількість осіб × (1 − знижка / 100)`
- Особистий кабінет «Мої замовлення» зі статусами
- Оплата замовлення (`POST /payments`)

**Для менеджера / адміністратора**
- Додавання, редагування та видалення турів, позначка «палаючий тур»
- Керування клієнтами: статус «постійний клієнт» та індивідуальна знижка
- Перегляд усіх замовлень і зміна їхніх статусів

**Загальне**
- Реєстрація та вхід із видачею JWT-токена
- Реактивний стек від контролерів до бази даних (без блокуючих викликів)
- Версіоване керування схемою БД через Flyway, у міграціях є тестові дані

## Технологічний стек

| Шар | Технології |
|-----|-----------|
| Бекенд | Java, Spring Boot 4.1, Spring WebFlux, Spring Data R2DBC, Spring Security |
| Автентифікація | JWT ([jjwt](https://github.com/jwtk/jjwt) 0.13) |
| База даних | PostgreSQL (R2DBC-драйвер для запитів, JDBC — для Flyway) |
| Міграції | Flyway |
| Збірка | Maven (Maven Wrapper) |
| Фронтенд | React 18, Vite 5, lucide-react |

> Версія Java задана в `pom.xml` (`java.version`). Переконайтеся, що встановлений JDK відповідає їй.

## Структура проєкту

```
travel-agency-reactive-app/
├── pom.xml
├── package.json                 # скрипти-обгортки для запуску фронтенду з кореня
├── src/main/java/com/ua/reactive/travelagencyreactiveapp/
│   ├── controller/              # REST-контролери (auth, tours, hotels, clients, bookings, payments)
│   ├── service/                 # бізнес-логіка
│   ├── repository/              # реактивні R2DBC-репозиторії
│   ├── entity/                  # сутності та enum-и (BookingStatus, TourType)
│   ├── security/                # JWT-фільтр, генерація токенів, конфігурація доступу
│   ├── router/ + handler/       # функціональні маршрути (/, /hello, /users, /admin)
│   └── TravelAgencyReactiveApp.java
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/            # Flyway: V1 схема, V2 типи турів і знижки, V3 тестові дані
└── frontend/                    # React + Vite застосунок
    └── src/components/          # Navbar, TourCard, TourModal, PaymentModal, MyBookings, AgentDashboard, ...
```

## Модель даних

Основні таблиці (див. `V1__Initial_db.sql` та `V2__Add_tour_type_and_discounts.sql`):

| Таблиця | Призначення |
|---------|-------------|
| `users`, `roles`, `user_roles` | облікові записи та ролі |
| `clients` | клієнти (у т.ч. `discount_percent`, `is_regular`) |
| `managers`, `admins` | співробітники, пов'язані з `users` |
| `hotels` | готелі (назва, місто, кількість зірок) |
| `tours` | тури (країна, готель, дата початку, тривалість, ціна за особу, вільні місця, `burning_tour`, `tour_type`, `image_url`, `description`) |
| `bookings` | бронювання (клієнт, тур, менеджер, кількість осіб, `status`, `discount_percent`, `total_price`) |
| `payments` | оплати (сума, дата, бронювання) |

**Статуси бронювання:** `NEW` → `CONFIRMED` → `PAID` / `CANCELLED`

**Типи турів:** `VACATION`, `EXCURSION`, `SHOPPING`

## Швидкий старт

### Передумови

- JDK (версія згідно з `pom.xml`)
- PostgreSQL
- Node.js та npm (для фронтенду)

### 1. База даних

Створіть порожню базу, наприклад `reactive_app`:

```sql
CREATE DATABASE reactive_app;
```

Таблиці та тестові дані створяться автоматично Flyway під час першого запуску.

### 2. Локальна конфігурація

`application.properties` підключає профіль `local` (`spring.profiles.include=local`), файл якого **не зберігається в репозиторії**. Створіть `src/main/resources/application-local.properties` (приклад — у розділі [Конфігурація](#конфігурація)).

### 3. Запуск бекенду

```bash
# Linux / macOS
./mvnw spring-boot:run

# Windows
./mvnw spring-boot:run
```

Бекенд стартує на `http://localhost:8080`.

### 4. Запуск фронтенду

```bash
npm run dev
```

Застосунок буде доступний на `http://localhost:5173`. Запити до API автоматично проксуються на `http://localhost:8080` (див. `frontend/vite.config.js`).

З кореня репозиторію також доступні скрипти `npm run dev`, `npm run build`, `npm run preview` — вони делегують виклики в `frontend/`.

## Конфігурація

Приклад `src/main/resources/application-local.properties`:

```properties
# R2DBC — підключення застосунку до БД
spring.r2dbc.url=r2dbc:postgresql://localhost:5432/reactive_app
spring.r2dbc.username=postgres
spring.r2dbc.password=your_password

# Flyway працює через JDBC
spring.flyway.url=jdbc:postgresql://localhost:5432/reactive_app
spring.flyway.user=postgres
spring.flyway.password=your_password

# JWT: секрет у форматі Base64 (обов'язково)
jwt.secret=<base64-encoded-secret>
# Час життя токена (необов'язково, за замовчуванням 1h)
jwt.expiration=1h
```

Сгенерувати секрет можна, наприклад, так:

```bash
openssl rand -base64 48
```

## REST API

Базова адреса: `http://localhost:8080`. Захищені ендпоїнти потребують заголовка:

```
Authorization: Bearer <jwt-token>
```

| Ресурс | Метод і шлях | Доступ |
|--------|--------------|--------|
| **Auth** | `POST /auth/register` — реєстрація (`{ "username", "password" }`) | усі |
| | `POST /auth/login` — вхід, повертає токен | усі |
| **Тури** | `GET /tours`, `GET /tours/{id}` | усі |
| | `POST /tours`, `PUT /tours/{id}`, `DELETE /tours/{id}` | менеджер, адмін |
| | `PATCH /tours/{id}/burning` — позначка «палаючий» | менеджер, адмін |
| **Готелі** | `GET /hotels`, `GET /hotels/{id}` | усі |
| | `POST /hotels` | менеджер, адмін |
| **Клієнти** | `GET /clients/me` — власний профіль | авторизований |
| | `GET /clients`, `GET /clients/{id}`, `PUT /clients/{id}` | менеджер, адмін |
| | `PATCH /clients/{id}/discount` — знижка та статус постійного клієнта | менеджер, адмін |
| **Бронювання** | `POST /bookings` — створити бронювання | авторизований |
| | `GET /bookings/my` — власні бронювання | авторизований |
| | `GET /bookings`, `GET /bookings/{id}`, `PUT /bookings/{id}`, `DELETE /bookings/{id}` | менеджер, адмін |
| | `PATCH /bookings/{id}/status` — зміна статусу | менеджер, адмін |
| **Оплати** | `POST /payments` — оплатити замовлення | авторизований |
| | `GET /payments`, `GET /payments/{id}` | клієнт, менеджер, адмін |
| **Службові** | `GET /`, `GET /hello` | усі |
| | `GET /users` | менеджер, адмін |
| | `GET /admin` | адмін |

Повні правила доступу описані в `security/WebSecurityConfig.java`.

### Приклад: реєстрація та вхід

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "client1", "password": "secret123"}'

curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "client1", "password": "secret123"}'
```

Відповідь містить JWT-токен, ролі користувача та ідентифікатори користувача й клієнта.

## Ролі та доступ

Ролі створюються міграцією `V1__Initial_db.sql`:

| Роль | Опис |
|------|------|
| `ROLE_CLIENT` | переглядає тури, бронює та оплачує |
| `ROLE_MANAGER` | керує турами, клієнтами, знижками та замовленнями |
| `ROLE_ADMIN` | повний доступ, включно з адміністративними маршрутами |

Під час реєстрації для користувача автоматично створюється профіль клієнта з нульовою знижкою.

## Фронтенд

Клієнтська частина розташована в каталозі [`frontend/`](frontend/) і використовує React + Vite. Основні компоненти:

- `TourCard`, `TourModal`, `TourFilters` — каталог, деталі та фільтри турів
- `AuthModal`, `AuthContext` — вхід, реєстрація, збереження сесії
- `PaymentModal`, `MyBookings` — оплата та перегляд власних замовлень
- `AgentDashboard` — панель менеджера (тури, клієнти зі знижками, замовлення)

Детальніше — у [`frontend/README.md`](frontend/README.md).

## Збірка

```bash
# Бекенд (JAR у target/)
./mvnw clean package

# Фронтенд (статичні файли у frontend/dist/)
npm run build
```
