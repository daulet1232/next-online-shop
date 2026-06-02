import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link href="/" className="logo logo--footer">
            <span>c</span>
            Community
          </Link>
          <p>Смартфоны из макета с каталогом, корзиной и личным кабинетом.</p>
        </div>
        <div className="footer__links">
          <Link href="/catalog">Каталог</Link>
          <Link href="/checkout">Оформление</Link>
          <Link href="/profile">Профиль</Link>
        </div>
      </div>
    </footer>
  );
}
