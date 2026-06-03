"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { changeCartQuantity, removeCartItem } from "@/app/actions";
import { type ShopCartItem, useShopStore } from "@/lib/store/shop-store";

const formatCartPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0
  }).format(price);

const quantityFormData = (itemId: string, direction: "minus" | "plus") => {
  const formData = new FormData();
  formData.set("itemId", itemId);
  formData.set("direction", direction);
  return formData;
};

const removeFormData = (itemId: string) => {
  const formData = new FormData();
  formData.set("itemId", itemId);
  return formData;
};

export function CartClient({ initialItems }: { initialItems: ShopCartItem[] }) {
  const [isReady, setIsReady] = useState(false);
  const [, startTransition] = useTransition();
  const storeItems = useShopStore((state) => state.cartItems);
  const setCartItems = useShopStore((state) => state.setCartItems);
  const changeCartItemQuantity = useShopStore((state) => state.changeCartItemQuantity);
  const removeCartItemState = useShopStore((state) => state.removeCartItem);
  const items = isReady ? storeItems : initialItems;
  const total = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  useEffect(() => {
    setCartItems(initialItems);
    setIsReady(true);
  }, [initialItems, setCartItems]);

  const changeQuantity = (itemId: string, direction: "minus" | "plus") => {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) return;

    const delta = direction === "plus" ? 1 : -1;
    const previousItems = items;

    changeCartItemQuantity(itemId, delta);

    startTransition(async () => {
      try {
        await changeCartQuantity(quantityFormData(itemId, direction));
      } catch {
        setCartItems(previousItems);
      }
    });
  };

  const removeItem = (itemId: string) => {
    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) return;

    const previousItems = items;
    removeCartItemState(itemId);

    startTransition(async () => {
      try {
        await removeCartItem(removeFormData(itemId));
      } catch {
        setCartItems(previousItems);
      }
    });
  };

  if (!items.length) {
    return (
      <div className="empty-state">
        <h2>Корзина пустая</h2>
        <p>Добавь товары из каталога, и они появятся здесь.</p>
        <Link className="button button--primary" href="/catalog">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-list">
        {items.map((item) => {
          const image = item.product.images[0];

          return (
            <article className="cart-item" key={item.id}>
              <Link className="cart-item__image product-visual product-image product-visual--card" href={`/product/${item.product.slug}`}>
                {image ? <img src={image.url} alt={image.alt || item.product.name} /> : <div className="product-image__missing">Нет изображения</div>}
              </Link>
              <div className="cart-item__info">
                <span>{item.product.brand}</span>
                <strong>{item.product.name}</strong>
                <small>{item.product.memory ?? item.product.battery}</small>
              </div>
              <div className="quantity">
                <button className="icon-button" type="button" aria-label="Уменьшить" onClick={() => changeQuantity(item.id, "minus")}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button className="icon-button" type="button" aria-label="Увеличить" onClick={() => changeQuantity(item.id, "plus")}>
                  <Plus size={16} />
                </button>
              </div>
              <strong>{formatCartPrice(item.product.price * item.quantity)}</strong>
              <button className="icon-button" type="button" aria-label="Удалить" onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </button>
            </article>
          );
        })}
      </div>
      <aside className="summary">
        <h2>Итого</h2>
        <div>
          <span>Товары</span>
          <strong>{formatCartPrice(total)}</strong>
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
  );
}
