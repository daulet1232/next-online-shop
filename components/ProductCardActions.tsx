"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { addToCart, toggleFavorite } from "@/app/actions";

export function ProductFavoriteButton({
  productId,
  callbackUrl,
  initialFavorite = false
}: {
  productId: string;
  callbackUrl: string;
  initialFavorite?: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  return (
    <form
      action={toggleFavorite}
      onSubmit={() => {
        setIsFavorite((current) => !current);
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
  const [cartAdds, setCartAdds] = useState(0);

  return (
    <form
      action={addToCart}
      onSubmit={() => {
        setCartAdds((current) => current + 1);
        window.dispatchEvent(new CustomEvent("community:cart-count-change", { detail: 1 }));
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
