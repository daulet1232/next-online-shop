import type { Prisma } from "@prisma/client";

export type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
  };
}>;
