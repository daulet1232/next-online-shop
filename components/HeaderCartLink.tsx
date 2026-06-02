"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeaderCartLink({
  href,
  initialCount
}: {
  href: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const updateCount = (event: Event) => {
      const delta = event instanceof CustomEvent && typeof event.detail === "number" ? event.detail : 1;
      setCount((current) => Math.max(0, current + delta));
    };

    window.addEventListener("community:cart-added", updateCount);
    window.addEventListener("community:cart-count-change", updateCount);

    return () => {
      window.removeEventListener("community:cart-added", updateCount);
      window.removeEventListener("community:cart-count-change", updateCount);
    };
  }, []);

  return (
    <Link className="icon-button cart-link" href={href} aria-label="Корзина">
      <ShoppingBag size={19} />
      {count > 0 ? <span>{count}</span> : null}
    </Link>
  );
}
