"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { addToCart, toggleFavorite } from "@/app/actions";
import { useShopStore } from "@/lib/store/shop-store";

export function ProductFavoriteButton({
  productId,
  callbackUrl,
  initialFavorite = false
}: {
  productId: string;
  callbackUrl: string;
  initialFavorite?: boolean;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const storeFavorite = useShopStore((state) => state.favoriteIds.includes(productId));
  const setFavorite = useShopStore((state) => state.setFavorite);
  const toggleFavoriteState = useShopStore((state) => state.toggleFavorite);
  const isFavorite = isHydrated ? storeFavorite : initialFavorite;

  useEffect(() => {
    if (initialFavorite) setFavorite(productId, true);
    setIsHydrated(true);
  }, [initialFavorite, productId, setFavorite]);

  return (
    <form
      action={toggleFavorite}
      onSubmit={() => {
        toggleFavoriteState(productId);
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <button
        className={isFavorite ? "icon-button product-card__favorite is-favorite" : "icon-button product-card__favorite"}
        type="submit"
        aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        aria-pressed={isFavorite}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </form>
  );
}

export function ProductCartButton({
  productId,
  callbackUrl
}: {
  productId: string;
  callbackUrl: string;
}) {
  const cartAdds = useShopStore((state) => state.productAddCounts[productId] ?? 0);
  const incrementProductAdd = useShopStore((state) => state.incrementProductAdd);

  return (
    <form
      action={addToCart}
      onSubmit={() => {
        incrementProductAdd(productId);
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <button className="icon-button icon-button--blue product-card__cart-button" type="submit" aria-label="В корзину">
        <ShoppingCart size={18} />
        {cartAdds > 0 ? <span className="product-card__cart-count">{cartAdds}</span> : null}
      </button>
    </form>
  );
}
