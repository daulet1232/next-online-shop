import { Heart, LogIn, UserRound } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { HeaderCartLink } from "@/components/HeaderCartLink";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function Header() {
  const session = await getServerSession(authOptions);
  const cartCount = session?.user?.id
    ? await prisma.cartItem.aggregate({
        where: { userId: session.user.id },
        _sum: { quantity: true }
      })
    : null;

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="logo" aria-label="Community">
          <span>c</span>
          Community
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <Link href="/catalog">Каталог</Link>
          <Link href="/catalog?isNew=1">Новинки</Link>
          <Link href="/catalog?inStock=1">В наличии</Link>
          <Link href="/catalog?price=under-200">До 200 000 ₸</Link>
        </nav>
        <div className="header-actions">
          <Link className="icon-button" href={session ? "/favorites" : "/login?callbackUrl=/favorites"} aria-label="Избранное">
            <Heart size={19} />
          </Link>
          <HeaderCartLink href={session ? "/cart" : "/login?callbackUrl=/cart"} initialCount={cartCount?._sum.quantity ?? 0} />
          <Link className="icon-button" href={session ? "/profile" : "/login?callbackUrl=/profile"} aria-label={session ? "Профиль" : "Войти"}>
            {session ? <UserRound size={19} /> : <LogIn size={19} />}
          </Link>
        </div>
      </div>
    </header>
  );
}
