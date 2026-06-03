"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { addToCart, toggleFavorite } from "@/app/actions";
import { useShopStore } from "@/lib/store/shop-store";

export function ProductDetailActions({
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
  const cartAdds = useShopStore((state) => state.productAddCounts[productId] ?? 0);
  const setFavorite = useShopStore((state) => state.setFavorite);
  const toggleFavoriteState = useShopStore((state) => state.toggleFavorite);
  const incrementProductAdd = useShopStore((state) => state.incrementProductAdd);
  const isFavorite = isHydrated ? storeFavorite : initialFavorite;

  useEffect(() => {
    if (initialFavorite) setFavorite(productId, true);
    setIsHydrated(true);
  }, [initialFavorite, productId, setFavorite]);

  return (
    <div className="buy-panel__actions">
      <form
        action={addToCart}
        onSubmit={() => {
          incrementProductAdd(productId);
        }}
      >
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <button className="button button--primary">
          <ShoppingCart size={18} />
          {cartAdds ? `В корзине +${cartAdds}` : "В корзину"}
        </button>
      </form>
      <form
        action={toggleFavorite}
        onSubmit={() => {
          toggleFavoriteState(productId);
        }}
      >
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <button className={isFavorite ? "icon-button is-favorite" : "icon-button"} aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}>
          <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </form>
    </div>
  );
}
