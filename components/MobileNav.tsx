import { Heart, Home, Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Мобильная навигация">
      <Link href="/">
        <Home size={20} />
        <span>Главная</span>
      </Link>
      <Link href="/catalog">
        <Search size={20} />
        <span>Каталог</span>
      </Link>
      <Link href="/favorites">
        <Heart size={20} />
        <span>Избранное</span>
      </Link>
      <Link href="/cart">
        <ShoppingBag size={20} />
        <span>Корзина</span>
      </Link>
      <Link href="/profile">
        <UserRound size={20} />
        <span>Профиль</span>
      </Link>
    </nav>
  );
}
