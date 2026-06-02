import { Star } from "lucide-react";
import Link from "next/link";
import { ProductCartButton, ProductFavoriteButton } from "@/components/ProductCardActions";
import { ProductVisual } from "@/components/ProductVisual";
import { formatPrice } from "@/lib/data";
import type { ProductWithImages } from "@/lib/types";

export function ProductCard({
  product,
  compact = false,
  initialFavorite = false
}: {
  product: ProductWithImages;
  compact?: boolean;
  initialFavorite?: boolean;
}) {
  const callbackUrl = `/product/${product.slug}`;

  return (
    <article className={compact ? "product-card product-card--compact" : "product-card"}>
      <div className="product-card__media">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {product.badge ? <span className="badge">{product.badge}</span> : null}
          <ProductVisual product={product} />
        </Link>
        <ProductFavoriteButton productId={product.id} callbackUrl={callbackUrl} initialFavorite={initialFavorite} />
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
          <ProductCartButton productId={product.id} callbackUrl={callbackUrl} />
        </div>
      </div>
    </article>
  );
}
