import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CartClient } from "@/components/CartClient";
import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/cart");

  const items = await getCart(session.user.id);
  const cartItems = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      brand: item.product.brand,
      price: item.product.price,
      memory: item.product.memory,
      battery: item.product.battery,
      images: item.product.images.map((image) => ({
        url: image.url,
        alt: image.alt
      }))
    }
  }));

  return (
    <section className="cart-page container">
      <div className="catalog-top">
        <div>
          <span className="eyebrow">Корзина</span>
          <h1>Ваш заказ</h1>
          <p>{items.length} позиций в корзине</p>
        </div>
      </div>
      <CartClient initialItems={cartItems} />
    </section>
  );
}
