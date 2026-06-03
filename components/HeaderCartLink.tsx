"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useShopStore } from "@/lib/store/shop-store";

export function HeaderCartLink({
  href,
  initialCount
}: {
  href: string;
  initialCount: number;
}) {
  const count = useShopStore((state) => state.cartCount);
  const setCartCount = useShopStore((state) => state.setCartCount);

  useEffect(() => {
    setCartCount(initialCount);
  }, [initialCount, setCartCount]);

  return (
    <Link className="icon-button cart-link" href={href} aria-label="Корзина">
      <ShoppingBag size={19} />
      {count > 0 ? <span>{count}</span> : null}
    </Link>
  );
}
