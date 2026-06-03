import { prisma } from "@/lib/prisma";

const productInclude = {
  category: true,
  images: {
    orderBy: {
      position: "asc" as const
    }
  }
};

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getProducts(params?: {
  category?: string;
  query?: string;
  featured?: boolean;
  price?: string;
  inStock?: boolean;
  isNew?: boolean;
  brand?: string;
}) {
  const rawQuery = params?.query?.trim();
  const queryAliases: Record<string, string> = {
    айфон: "iphone",
    iphone: "iphone",
    эпл: "apple",
    apple: "apple",
    хонор: "honor",
    honor: "honor",
    хуавей: "huawei",
    huawei: "huawei",
    редми: "redmi",
    redmi: "redmi",
    ксиоми: "xiaomi",
    xiaomi: "xiaomi"
  };
  const normalizedQuery = rawQuery ? (queryAliases[rawQuery.toLowerCase()] ?? rawQuery) : undefined;

  return prisma.product.findMany({
    where: {
      category: { slug: params?.category ?? "smartphones" },
      brand: params?.brand,
      isFeatured: params?.featured,
      isNew: params?.isNew || undefined,
      stock: params?.inStock ? { gt: 0 } : undefined,
      price:
        params?.price === "under-200"
          ? { lt: 200000 }
          : params?.price === "200-500"
            ? { gte: 200000, lte: 500000 }
            : params?.price === "over-500"
              ? { gt: 500000 }
              : undefined,
      OR: normalizedQuery
        ? [
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { slug: { contains: normalizedQuery, mode: "insensitive" } },
            { brand: { contains: normalizedQuery, mode: "insensitive" } },
            { description: { contains: normalizedQuery, mode: "insensitive" } },
            { memory: { contains: normalizedQuery, mode: "insensitive" } },
            { screen: { contains: normalizedQuery, mode: "insensitive" } },
            { processor: { contains: normalizedQuery, mode: "insensitive" } },
            { color: { contains: normalizedQuery, mode: "insensitive" } }
          ]
        : undefined
    },
    include: productInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
  });
}

export async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude
  });
}

export async function getRelatedProducts(slug: string) {
  const product = await getProduct(slug);
  if (!product) return [];

  return prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { slug }
    },
    include: productInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 4
  });
}

export async function getCart(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: productInclude
      }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: productInclude
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getFavoriteProductIds(userId: string, productIds: string[]) {
  if (!productIds.length) return [];

  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
      productId: { in: productIds }
    },
    select: { productId: true }
  });

  return favorites.map((favorite) => favorite.productId);
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0
  }).format(price);
