import clsx from "clsx";
import type { ProductWithImages } from "@/lib/types";

export function ProductVisual({
  product,
  size = "card"
}: {
  product: Pick<ProductWithImages, "name" | "images">;
  size?: "card" | "hero";
}) {
  const image = product.images[0];

  return (
    <div className={clsx("product-visual product-image", `product-visual--${size}`)}>
      {image ? <img src={image.url} alt={image.alt || product.name} /> : <div className="product-image__missing">Нет изображения в БД</div>}
    </div>
  );
}
