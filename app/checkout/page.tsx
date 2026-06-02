import { CreditCard, MapPin, PackageCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { formatPrice, getCart } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const items = await getCart(session.user.id);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <section className="checkout-page container">
      <div className="catalog-top">
        <div>
          <span className="eyebrow">Оформление</span>
          <h1>Данные заказа</h1>
          <p>Проверь контактные данные и адрес доставки.</p>
        </div>
      </div>
      <div className="checkout-grid">
        <form className="checkout-form">
          <label>
            Имя
            <input name="customer" defaultValue={session.user.name ?? ""} />
          </label>
          <label>
            Телефон
            <input name="phone" placeholder="+7 700 000 00 00" />
          </label>
          <label>
            Адрес доставки
            <input name="address" placeholder="Улица, дом, квартира" />
          </label>
          <div className="checkout-options">
            <label>
              <input type="radio" name="delivery" defaultChecked /> Курьер
            </label>
            <label>
              <input type="radio" name="delivery" /> Самовывоз
            </label>
          </div>
          <button className="button button--primary" type="button" disabled={!items.length}>
            Подтвердить заказ
          </button>
        </form>
        <aside className="summary summary--checkout">
          <MapPin size={22} />
          <h2>Доставка сегодня</h2>
          <p>Курьер свяжется за 30 минут до приезда.</p>
          <div>
            <span>Оплата</span>
            <strong>
              <CreditCard size={16} /> картой
            </strong>
          </div>
          <div>
            <span>К выдаче</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className="success-note">
            <PackageCheck size={18} />
            Заказ будет сохранен в профиле
          </div>
        </aside>
      </div>
    </section>
  );
}
