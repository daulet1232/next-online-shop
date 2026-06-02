import Link from "next/link";
import { ArrowRight, BadgeCheck, Truck, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await getProducts({ featured: true });
  const heroProduct = featuredProducts[0];

  return (
    <>
      <section className="hero container">
        <div className="hero__content">
          <span className="eyebrow">Community smartphones</span>
          <h1>Смартфоны для работы, съёмки и повседневных дел</h1>
          <p>Собрали актуальные модели из макета: Apple, Honor, Huawei и Redmi с быстрым поиском, фильтрами и корзиной.</p>
          <div className="hero__actions">
            <Link className="button button--primary" href="/catalog">
              В каталог <ArrowRight size={18} />
            </Link>
            {heroProduct ? (
              <Link className="button button--ghost" href={`/product/${heroProduct.slug}`}>
                Смотреть хит
              </Link>
            ) : null}
          </div>
        </div>
        {heroProduct ? (
          <Link href={`/product/${heroProduct.slug}`} className="hero__device" aria-label={heroProduct.name}>
            <ProductVisual product={heroProduct} size="hero" />
            <div>
              <span>{heroProduct.brand}</span>
              <strong>{heroProduct.name}</strong>
            </div>
          </Link>
        ) : (
          <div className="hero__device hero__device--empty">
            <strong>Каталог ожидает данные</strong>
            <span>После миграции и наполнения БД featured-товар появится здесь.</span>
          </div>
        )}
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <span className="eyebrow">Популярное</span>
            <h2>Выбор смартфонов</h2>
          </div>
          <Link href="/catalog">Все товары</Link>
        </div>
        {featuredProducts.length ? (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Featured-товаров пока нет</h2>
            <p>Заполни таблицы Category, Product и ProductImage.</p>
          </div>
        )}
      </section>

      <section className="benefits container">
        <div>
          <BadgeCheck size={22} />
          <strong>Оригинальные смартфоны</strong>
          <p>Карточки с фото из Figma, ценами и характеристиками.</p>
        </div>
        <div>
          <Truck size={22} />
          <strong>Быстрая доставка</strong>
          <p>Доставка по городу и самовывоз из удобных точек.</p>
        </div>
        <div>
          <ShieldCheck size={22} />
          <strong>Поддержка после покупки</strong>
          <p>Поможем с настройкой, возвратом и выбором модели.</p>
        </div>
      </section>
    </>
  );
}
