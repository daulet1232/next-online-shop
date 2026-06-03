import { getServerSession } from "next-auth";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import { authOptions } from "@/lib/auth";
import { getFavoriteProductIds, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [products, session] = await Promise.all([
    getProducts({
      query: params.q,
      price: params.price,
      inStock: params.inStock === "1",
      isNew: params.isNew === "1",
      brand: params.brand
    }),
    getServerSession(authOptions)
  ]);
  const favoriteIds = session?.user?.id ? await getFavoriteProductIds(session.user.id, products.map((product) => product.id)) : [];
  const favoriteIdSet = new Set(favoriteIds);

  return (
    <section className="catalog-page container">
      <div className="catalog-top">
        <div>
          <span className="eyebrow">Каталог смартфонов</span>
          <h1>{params.q ? `Поиск: ${params.q}` : "Смартфоны Community"}</h1>
          <p>{products.length} смартфонов в подборке</p>
        </div>
      </div>
      <div className="catalog-layout">
        <FilterPanel active={params} />
        <div className="catalog-content">
          <form className="catalog-search" action="/catalog">
            <input name="q" defaultValue={params.q ?? ""} placeholder="Найти смартфон" />
            <button className="button button--primary" type="submit">
              Искать
            </button>
          </form>
          {products.length ? (
            <div className="product-grid product-grid--catalog">
              {products.map((product) => (
                <ProductCard product={product} initialFavorite={favoriteIdSet.has(product.id)} key={product.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Ничего не найдено</h2>
              <p>Попробуй изменить запрос, бренд или диапазон цены.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
