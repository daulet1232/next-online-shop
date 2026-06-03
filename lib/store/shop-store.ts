"use client";

import { create } from "zustand";

export type ShopCartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    memory: string | null;
    battery: string | null;
    images: {
      url: string;
      alt: string;
    }[];
  };
};

type ShopStore = {
  cartCount: number;
  cartItems: ShopCartItem[];
  productAddCounts: Record<string, number>;
  favoriteIds: string[];
  setCartCount: (count: number) => void;
  setCartItems: (items: ShopCartItem[]) => void;
  incrementProductAdd: (productId: string) => void;
  rollbackProductAdd: (productId: string) => void;
  changeCartItemQuantity: (itemId: string, delta: 1 | -1) => void;
  removeCartItem: (itemId: string) => void;
  setFavorite: (productId: string, favorite: boolean) => void;
  toggleFavorite: (productId: string) => void;
};

const countItems = (items: ShopCartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);

export const useShopStore = create<ShopStore>((set) => ({
  cartCount: 0,
  cartItems: [],
  productAddCounts: {},
  favoriteIds: [],
  setCartCount: (count) => set({ cartCount: Math.max(0, count) }),
  setCartItems: (items) => set({ cartItems: items, cartCount: countItems(items) }),
  incrementProductAdd: (productId) =>
    set((state) => ({
      cartCount: state.cartCount + 1,
      productAddCounts: {
        ...state.productAddCounts,
        [productId]: (state.productAddCounts[productId] ?? 0) + 1
      }
    })),
  rollbackProductAdd: (productId) =>
    set((state) => ({
      cartCount: Math.max(0, state.cartCount - 1),
      productAddCounts: {
        ...state.productAddCounts,
        [productId]: Math.max(0, (state.productAddCounts[productId] ?? 0) - 1)
      }
    })),
  changeCartItemQuantity: (itemId, delta) =>
    set((state) => {
      let appliedDelta = 0;
      const cartItems = state.cartItems.flatMap((item) => {
        if (item.id !== itemId) return item;
        const nextQuantity = item.quantity + delta;
        appliedDelta = delta;
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      });

      return {
        cartItems,
        cartCount: Math.max(0, state.cartCount + appliedDelta)
      };
    }),
  removeCartItem: (itemId) =>
    set((state) => {
      const item = state.cartItems.find((entry) => entry.id === itemId);

      return {
        cartItems: state.cartItems.filter((entry) => entry.id !== itemId),
        cartCount: Math.max(0, state.cartCount - (item?.quantity ?? 0))
      };
    }),
  setFavorite: (productId, favorite) =>
    set((state) => {
      const exists = state.favoriteIds.includes(productId);
      if (favorite && !exists) return { favoriteIds: [...state.favoriteIds, productId] };
      if (!favorite && exists) return { favoriteIds: state.favoriteIds.filter((id) => id !== productId) };
      return state;
    }),
  toggleFavorite: (productId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(productId)
        ? state.favoriteIds.filter((id) => id !== productId)
        : [...state.favoriteIds, productId]
    }))
}));
