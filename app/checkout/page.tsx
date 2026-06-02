import { CreditCard, MapPin, PackageCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { createTestOrder } from "@/app/actions";
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
        <form className="checkout-form" action={createTestOrder}>
          <label>
            Имя
            <input name="customer" defaultValue={session.user.name ?? ""} required />
          </label>
          <label>
            Телефон
            <input name="phone" placeholder="+7 700 000 00 00" required />
          </label>
          <label>
            Адрес доставки
            <input name="address" placeholder="Улица, дом, квартира" required />
          </label>
          <div className="checkout-options">
            <label>
              <input type="radio" name="delivery" defaultChecked /> Курьер
            </label>
            <label>
              <input type="radio" name="delivery" /> Самовывоз
            </label>
          </div>
          <div className="fake-payment">
            <strong>Тестовая оплата</strong>
            <label>
              Номер карты
              <input name="card" inputMode="numeric" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
            </label>
            <div>
              <label>
                Срок
                <input name="expiry" placeholder="12/30" defaultValue="12/30" />
              </label>
              <label>
                CVC
                <input name="cvc" inputMode="numeric" placeholder="123" defaultValue="123" />
              </label>
            </div>
            <p>Деньги не списываются. Заказ создается в БД как оплаченный.</p>
          </div>
          <button className="button button--primary" type="submit" disabled={!items.length}>
            Оплатить тестово
          </button>
        </form>
        <aside className="summary summary--checkout">
          <MapPin size={22} />
          <h2>Доставка сегодня</h2>
          <p>Курьер свяжется за 30 минут до приезда.</p>
          <div>
            <span>Оплата</span>
            <strong>
              <CreditCard size={16} /> тестовой картой
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
