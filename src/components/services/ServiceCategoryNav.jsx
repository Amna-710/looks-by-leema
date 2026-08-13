import './ServicesBrowse.css';

export default function ServiceCategoryNav({ categories, activeId, onChange }) {
  return (
    <div className="svc-nav" role="tablist" aria-label="Service categories">
      <div className="svc-nav__scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeId === cat.id}
            className={`svc-nav__tab ${activeId === cat.id ? 'svc-nav__tab--active' : ''}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.navLabel || cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
