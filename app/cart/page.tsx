import { Minus, Plus, Trash2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { changeCartQuantity, removeCartItem } from "@/app/actions";
import { ProductVisual } from "@/components/ProductVisual";
import { authOptions } from "@/lib/auth";
import { formatPrice, getCart } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/cart");

  const items = await getCart(session.user.id);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <section className="cart-page container">
      <div className="catalog-top">
        <div>
          <span className="eyebrow">Корзина</span>
          <h1>Ваш заказ</h1>
          <p>{items.length} позиций в корзине</p>
        </div>
      </div>
      {items.length ? (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <ProductVisual product={item.product} />
                <div>
                  <span>{item.product.brand}</span>
                  <strong>{item.product.name}</strong>
                  <small>{item.product.memory ?? item.product.battery}</small>
                </div>
                <div className="quantity">
                  <form action={changeCartQuantity}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="direction" value="minus" />
                    <button className="icon-button" aria-label="Уменьшить">
                      <Minus size={16} />
                    </button>
                  </form>
                  <span>{item.quantity}</span>
                  <form action={changeCartQuantity}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="direction" value="plus" />
                    <button className="icon-button" aria-label="Увеличить">
                      <Plus size={16} />
                    </button>
                  </form>
                </div>
                <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                <form action={removeCartItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button className="icon-button" aria-label="Удалить">
                    <Trash2 size={18} />
                  </button>
                </form>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Итого</h2>
            <div>
              <span>Товары</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div>
              <span>Доставка</span>
              <strong>0 ₸</strong>
            </div>
            <Link className="button button--primary" href="/checkout">
              Оформить заказ
            </Link>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <h2>Корзина пустая</h2>
          <p>Добавь товары из каталога, и они появятся здесь.</p>
          <Link className="button button--primary" href="/catalog">
            Перейти в каталог
          </Link>
        </div>
      )}
    </section>
  );
}
