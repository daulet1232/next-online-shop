import { notFound } from "next/navigation";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { addToCart, toggleFavorite } from "@/app/actions";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { getProduct, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.slug);

  return (
    <section className="product-page container">
      <div className="breadcrumbs">Главная / {product.category.name} / {product.name}</div>
      <div className="product-detail">
        <div className="product-detail__gallery">
          <ProductVisual product={product} size="hero" />
        </div>
        <div className="product-detail__info">
          <span className="eyebrow">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="product-detail__rating">
            <Star size={17} fill="currentColor" /> {product.rating} · {product.reviews} отзывов
          </div>
          <p>{product.description}</p>
          <div className="product-specs">
            <div>
              <span>Память</span>
              <strong>{product.memory ?? "без накопителя"}</strong>
            </div>
            <div>
              <span>Экран</span>
              <strong>{product.screen ?? "не указан"}</strong>
            </div>
            <div>
              <span>Процессор</span>
              <strong>{product.processor ?? "не указан"}</strong>
            </div>
            <div>
              <span>Аккумулятор</span>
              <strong>{product.battery ?? "не указан"}</strong>
            </div>
          </div>
          <div className="buy-panel">
            <div>
              <span>Цена</span>
              <strong>{formatPrice(product.price)}</strong>
              {product.oldPrice ? <del>{formatPrice(product.oldPrice)}</del> : null}
            </div>
            <div className="buy-panel__actions">
              <form action={addToCart}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="callbackUrl" value={`/product/${product.slug}`} />
                <button className="button button--primary">
                  <ShoppingCart size={18} />
                  В корзину
                </button>
              </form>
              <form action={toggleFavorite}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="callbackUrl" value={`/product/${product.slug}`} />
                <button className="icon-button" aria-label="Добавить в избранное">
                  <Heart size={19} />
                </button>
              </form>
            </div>
            <p>
              <Truck size={17} /> Доставка завтра или самовывоз сегодня
            </p>
          </div>
        </div>
      </div>
      <div className="section__head">
        <div>
          <span className="eyebrow">Похожие</span>
          <h2>Можно сравнить</h2>
        </div>
      </div>
      <div className="product-grid product-grid--catalog">
        {related.map((item) => (
          <ProductCard product={item} key={item.id} compact />
        ))}
      </div>
    </section>
  );
}
