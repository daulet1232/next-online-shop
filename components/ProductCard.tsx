import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { addToCart, toggleFavorite } from "@/app/actions";
import { ProductVisual } from "@/components/ProductVisual";
import { formatPrice } from "@/lib/data";
import type { ProductWithImages } from "@/lib/types";

export function ProductCard({
  product,
  compact = false
}: {
  product: ProductWithImages;
  compact?: boolean;
}) {
  const callbackUrl = `/product/${product.slug}`;

  return (
    <article className={compact ? "product-card product-card--compact" : "product-card"}>
      <div className="product-card__media">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {product.badge ? <span className="badge">{product.badge}</span> : null}
          <ProductVisual product={product} />
        </Link>
        <form action={toggleFavorite}>
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button className="icon-button product-card__favorite" type="submit" aria-label="Добавить в избранное">
            <Heart size={18} />
          </button>
        </form>
      </div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.brand}</span>
          <span className="rating">
            <Star size={14} fill="currentColor" /> {product.rating}
          </span>
        </div>
        <Link href={`/product/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>
        <p>{product.description}</p>
        <div className="product-card__bottom">
          <div>
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice ? <del>{formatPrice(product.oldPrice)}</del> : null}
          </div>
          <form action={addToCart}>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button className="icon-button icon-button--blue" type="submit" aria-label="В корзину">
              <ShoppingCart size={18} />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
