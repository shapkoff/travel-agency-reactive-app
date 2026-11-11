-- Sample Hotels
INSERT INTO hotels (name, city, stars) VALUES
('Rixos Premium Belek', 'Анталія', 5),
('Hilton Diagonal Mar', 'Барселона', 4),
('Grand Hotel et de Milan', 'Мілан', 5),
('Royal Savoy Sharm', 'Шарм-ель-Шейх', 5),
('Hotel Le Louvre Rivoli', 'Париж', 4),
('The Marmara Taksim', 'Стамбул', 5);

-- Sample Tours
-- 1) Відпочинок (VACATION)
INSERT INTO tours (title, country, hotel_id, start_date, duration_days, price_per_person, seats_available, burning_tour, tour_type, image_url, description) VALUES
('Казкова Анталія — All Inclusive', 'Туреччина', 1, CURRENT_DATE + INTERVAL '5 days', 7, 450.00, 18, true, 'VACATION',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
 'Преміальний відпочинок на Середземному морі в готелі 5 зірок. Харчування Ultra All Inclusive, власний піщаний пляж, SPA-комплекс та аквапарк.'),

('Сонячний Шарм-ель-Шейх: Червоне Море та Корали', 'Єгипет', 4, CURRENT_DATE + INTERVAL '12 days', 10, 520.00, 14, false, 'VACATION',
 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
 'Відпочинок у затишній бухті з неймовірним живим кораловим рифом. Дайвінг, снорклінг, вечірні шоу та розкішний сервіс.'),

('Золоті Пляжі Барселони & Коста-Брава', 'Іспанія', 2, CURRENT_DATE + INTERVAL '20 days', 8, 680.00, 10, false, 'VACATION',
 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
 'Поєднання пляжного релаксу на узбережжі Середземного моря з можливістю вечірніх прогулянок колоритною набережною Барселони.');

-- 2) Екскурсія (EXCURSION)
INSERT INTO tours (title, country, hotel_id, start_date, duration_days, price_per_person, seats_available, burning_tour, tour_type, image_url, description) VALUES
('Перлини Парижа: Лувр, Версаль та Ейфелева Вежа', 'Франція', 5, CURRENT_DATE + INTERVAL '7 days', 5, 390.00, 15, true, 'EXCURSION',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
 'Насичена екскурсійна програма серцем Франції: відвідування музею Лувр з гідом, підйом на Монмартр, прогулянка на кораблику по Сені та романтичний вечір біля вежі.'),

('Шедеври Гауді та Готичний квартал Барселони', 'Іспанія', 2, CURRENT_DATE + INTERVAL '14 days', 6, 430.00, 12, false, 'EXCURSION',
 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
 'Архітектурна подорож: собор Саграда Фамілія, парк Гуель, прогулянка лабіринтами Готичного кварталу та шоу магічних фонтанів.');

-- 3) Шопінг (SHOPPING)
INSERT INTO tours (title, country, hotel_id, start_date, duration_days, price_per_person, seats_available, burning_tour, tour_type, image_url, description) VALUES
('Міланський шопінг-вікенд: Serravalle Outlet & Galleria', 'Італія', 3, CURRENT_DATE + INTERVAL '3 days', 4, 320.00, 8, true, 'SHOPPING',
 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
 'Подорож до світової столиці моди! Трансфер до найбільшого аутлету Serravalle з знижками до -70%, персональні шопінг-консультації та кава у Галереї Віктора Емануїла II.'),

('Гранд-Базар та сучасні аутлети Стамбула', 'Туреччина', 6, CURRENT_DATE + INTERVAL '9 days', 4, 280.00, 16, false, 'SHOPPING',
 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
 'Шопінг у найкращих моллах Mall of Istanbul та Zorlu Center, колоритний Єгипетський базар спецій, турецькі солодощі та текстильні бутики.');
