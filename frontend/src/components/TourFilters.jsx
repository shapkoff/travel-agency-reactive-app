import React from 'react';
import { Search, Flame, Palmtree, Landmark, ShoppingBag, Layers } from 'lucide-react';

export const TourFilters = ({
  selectedType,
  onTypeChange,
  onlyBurning,
  onToggleBurning,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  const categories = [
    { id: '', label: 'Всі тури', icon: Layers },
    { id: 'VACATION', label: 'Відпочинок', icon: Palmtree },
    { id: 'EXCURSION', label: 'Екскурсія', icon: Landmark },
    { id: 'SHOPPING', label: 'Шопінг', icon: ShoppingBag }
  ];

  return (
    <div className="filters-container">
      <div className="filters-row">
        {/* Category Chips */}
        <div className="category-chips">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedType === cat.id;
            return (
              <button
                key={cat.id}
                className={`category-chip ${isActive ? 'active' : ''}`}
                onClick={() => onTypeChange(cat.id)}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hot / Burning Tour Toggle */}
        <button
          className={`burning-toggle ${onlyBurning ? 'active' : ''}`}
          onClick={onToggleBurning}
          title="Показати лише палаючі тури зі знижками"
        >
          <Flame size={16} />
          <span>Тільки палаючі тури</span>
        </button>
      </div>

      <div className="filters-row" style={{ marginTop: '0.25rem' }}>
        {/* Search Input */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Пошук за назвою, країною або готелем..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-light)', fontWeight: '500' }}>Сортувати:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Рекомендовані</option>
            <option value="price-asc">Ціна: від найнижчої</option>
            <option value="price-desc">Ціна: від найвищої</option>
            <option value="duration">Тривалість туру</option>
          </select>
        </div>
      </div>
    </div>
  );
};
