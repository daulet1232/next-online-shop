import Link from "next/link";

const priceOptions = [
  ["under-200", "До 200 000 ₸"],
  ["200-500", "200 000 - 500 000 ₸"],
  ["over-500", "От 500 000 ₸"]
] as const;

const brandOptions = ["Apple", "Honor", "Huawei", "Redmi"] as const;

export function FilterPanel({ active }: { active: Record<string, string | undefined> }) {
  const href = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...active, q: undefined, ...next };

    Object.entries(merged).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return `/catalog${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <aside className="filters" id="filters">
      <div className="filters__head">
        <strong>Фильтры</strong>
        <Link href="/catalog">Сбросить</Link>
      </div>
      <div className="filters__group">
        <span>Бренд</span>
        {brandOptions.map((brand) => (
          <Link className={active.brand === brand ? "is-active" : ""} href={href({ brand: active.brand === brand ? undefined : brand })} key={brand}>
            {brand}
          </Link>
        ))}
      </div>
      <div className="filters__group">
        <span>Цена</span>
        {priceOptions.map(([value, label]) => (
          <Link className={active.price === value ? "is-active" : ""} href={href({ price: active.price === value ? undefined : value })} key={value}>
            {label}
          </Link>
        ))}
      </div>
      <div className="filters__group">
        <span>Состояние</span>
        <Link className={active.inStock ? "is-active" : ""} href={href({ inStock: active.inStock ? undefined : "1" })}>
          В наличии
        </Link>
        <Link className={active.isNew ? "is-active" : ""} href={href({ isNew: active.isNew ? undefined : "1" })}>
          Новинки
        </Link>
      </div>
    </aside>
  );
}
