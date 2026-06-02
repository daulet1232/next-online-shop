import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { authOptions } from "@/lib/auth";
import { getFavorites } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/favorites");

  const favorites = await getFavorites(session.user.id);

  return (
    <section className="section container">
      <div className="section__head">
        <div>
          <span className="eyebrow">Избранное</span>
          <h1>Отложенные товары</h1>
        </div>
      </div>
      {favorites.length ? (
        <div className="product-grid product-grid--catalog">
          {favorites.map((favorite) => (
            <ProductCard product={favorite.product} key={favorite.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Пока пусто</h2>
          <p>Добавленные в избранное товары появятся здесь.</p>
        </div>
      )}
    </section>
  );
}
